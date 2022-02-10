import * as fs from "fs";

//
// parse emails file columns into array
export const emailsToArray = (filePath: string) => {
    const str = fs.readFileSync(filePath, "utf-8");
    return str.split("\n").filter(String);
};

//
// return int found in filePath
export const getCurrNumPosts = (filePath: string) => {
    try {
        const res = fs.readFileSync(filePath, "utf8");
        return parseInt(res);
    } catch (err) {
        return null;
    }
};

//
// create and write value to new count file
export const writeCountFile = (filePath: string, val: number) => {
    fs.writeFile(filePath, val.toString(), (err) => {
        if (err) return console.log(err);
        console.log("The file was saved!");
    });
};

export const formatPostContent = (tableEntry: string) => {
    return tableEntry;
};
