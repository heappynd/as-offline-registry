#!/usr/bin/env node

import { execSync } from "child_process";
import path from "path";

const [action, component] = process.argv.slice(2);

const commonEnv = {
  ...process.env,
  REGISTRY_URL: "http://localhost:4873/s",
  ELEMENTS_REGISTRY_URL: "http://localhost:4873/a/components/",
};

/**
 * @param {string} baseCmd - 基础命令 (如 'npx shadcn-vue' 或 'node path/to/cli.cjs')
 * @param {string} compName - 处理后的组件名 (已剥离前缀)
 * @param {boolean} useY - 是否追加 -y 参数 (npx 工具通常需要，本地脚本看需求)
 */
const runCommand = (baseCmd, compName, useY = true) => {
  // 组装命令：注意不再直接用原始的 component，而是用 compName
  const fullCmd = `${baseCmd} ${action} ${compName}${useY ? " -y" : ""}`;

  console.log(`\n🚀 正在调用: ${fullCmd}`);
  try {
    execSync(fullCmd, { stdio: "inherit", env: commonEnv });
  } catch (e) {
    console.error(`❌ 执行失败`);
  }
};

if (action === "add" && component) {
  if (component.startsWith("ai:")) {
    // 1. 剥离前缀：'ai:message' -> 'message'
    const strippedComponent = component.replace(/^ai:/, "");

    // 2. 获取绝对路径
    const aiCliPath = path.resolve(import.meta.dirname, "./ai-cli.cjs");

    // 3. 执行：本地 cjs 脚本通常不需要 -y，或者由你决定是否透传
    // 得到的命令：node C:\...\ai-cli.cjs add message
    runCommand(`node ${aiCliPath}`, strippedComponent, false);
  } else {
    // shadcn-vue 原生支持 -y
    // 得到的命令：npx shadcn-vue add button -y
    runCommand("npx shadcn-vue", component, true);
  }
} else {
  console.log("使用方法: node cli.js add [component-name]");
  console.log("示例: node cli.js add button  (调用 shadcn)");
  console.log("示例: node cli.js add ai:message (调用 ai-elements)");
}
