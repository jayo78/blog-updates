import puppeteer from "puppeteer";
import * as nodemailer from "nodemailer";
import { writeCountFile, emailsToArray, formatPostContent, getCurrNumPosts } from "./utils";
import dotenv from "dotenv";
dotenv.config();

const config = {
    blogUrl: "https://seam.cs.umd.edu/purtilo/435/blog.html",
    cntStateFileName: ".count.STATE",
    emailsFile: "emails.txt",
    emailSender: process.env.EMAIL_SENDER,
    emailPass: process.env.EMAIL_PASS,
};

//
// fetch rendered html and parse the table entries
const getTableEntries = async (url: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "networkidle0",
    });

    const tableEntries = await page.evaluate(() => {
        const tds = Array.from(document.querySelectorAll("table tr td")) as HTMLElement[];
        return tds.map((td) => td.innerText);
    });

    await browser.close();

    // don't want blog header - slice it off
    return tableEntries.slice(1);
};

//
// send new post in emails
const sendEmailUpdates = async (newPostsContent: string) => {
    let emails = emailsToArray(config.emailsFile);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        socketTimeout: 5000,
        auth: {
            user: config.emailSender,
            pass: config.emailPass,
        },
    });

    await Promise.all(
        emails.map((email) =>
            transporter.sendMail({
                from: process.env.EMAIL_SENDER,
                to: email,
                subject: "Fresh 435 Blog Content",
                text: newPostsContent,
            })
        )
    );
};

//
// scrape => check if new posts => send new posts to email list
(async () => {
    console.log("[Main] fetching updates");
    const entries = await getTableEntries(config.blogUrl);
    console.log("[Main] got num entries: " + entries.length);
    const currNumPosts = getCurrNumPosts(config.cntStateFileName);

    if (currNumPosts === null) {
        // no count state file - first time running
        // write new count state file with entries.length so we don't send all posts
        writeCountFile(config.cntStateFileName, entries.length);
    } else {
        const diff = entries.length - currNumPosts;
        console.log("[Main] diff: " + diff);
        if (diff) {
            const posts = entries
                .reverse()
                .slice(currNumPosts)
                .map((post) => formatPostContent(post));
            const postsContent = posts.join("\n");
            console.log("[Main] sending emails");
            sendEmailUpdates(postsContent);
            writeCountFile(config.cntStateFileName, entries.length);
        }
    }
})();
