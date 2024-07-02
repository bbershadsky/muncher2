import { NextApiRequest, NextApiResponse } from "next";
import { exec } from "child_process";
import path from "path";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { url } = req.body;

  if (!url) {
    res.status(400).json({ message: "URL is required" });
    return;
  }

  const scriptPath = path.resolve("process_all.sh");

  exec(`bash ${scriptPath} ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.status(200).json({ message: "Processing started", output: stdout });
  });
};
