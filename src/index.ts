import puppeteer from "puppeteer";
import * as nodemailer from "nodemailer";
import { emailsToArray, formatPostContent, getCurrNumPosts } from "./utils";

const config = {
    blogUrl: "https://seam.cs.umd.edu/purtilo/435/blog.html",
    postCountFile: ".count.PERSIST",
    emailsFile: "emails.txt",
    emailSender: process.env.EMAIL_SENDER,
    emailPass: process.env.EMAIL_PASS,
};

//
// fetch rendered html and parse the table entries
const getTableEntries = async (url: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://seam.cs.umd.edu/purtilo/435/blog.html", {
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

(async () => {
    const entries = await getTableEntries(config.blogUrl);
    console.log("num entries: " + entries.length);
    const currNumPosts = getCurrNumPosts(config.postCountFile);

    const diff = entries.length - currNumPosts;
    console.log("diff: " + diff);
    if (diff) {
        const posts = entries.slice(currNumPosts).map((post) => formatPostContent(post));
        const postsContent = posts.join(
            "\n========================================================================\n"
        );
        console.log(postsContent);
        // sendEmailUpdates(postsContent);
    }
})();
