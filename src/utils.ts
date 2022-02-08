import * as fs from "fs";

//
// parse emails file columns into array
export const emailsToArray = (filePath: string) => {
    const str = fs.readFileSync(filePath, "utf8");
    return str.split("\n");
};

//
// return int found in filePath
export const getCurrNumPosts = (filePath: string) => {
    const res = fs.readFileSync(filePath, "utf8");
    return parseInt(res);
};

export const formatPostContent = (tableEntry: string) => {
    return tableEntry;
};
