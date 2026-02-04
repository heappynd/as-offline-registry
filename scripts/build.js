import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// 封装跨平台执行函数
const run = (cmd, cwd) => {
  console.log(`\n🚀 正在执行: ${cmd} ${cwd ? `在 ${cwd}` : ''}`);
  try {
    // stdio: 'inherit' 让 pnpm 的进度条和日志能直接显示在控制台
    execSync(cmd, { stdio: 'inherit', cwd });
  } catch (err) {
    console.error(`\n❌ 执行失败: ${cmd}`);
    process.exit(1);
  }
};

// 1. 清理并创建 dist 目录
console.log('🧹 正在清理 dist 目录...');
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true });
}
fs.mkdirSync('dist', { recursive: true });

// 2. 处理第一个仓库: shadcn-vue
const path1 = 'repos/shadcn-vue';
if (fs.existsSync(path1)) {
  run('pnpm install', path1);
  run('pnpm registry:build-only', path1);
} else {
  console.error(`❌ 错误: 找不到路径 ${path1}`);
}

// 3. 处理第二个仓库: ai-elements-vue
const path2 = 'repos/ai-elements-vue';
if (fs.existsSync(path2)) {
  run('pnpm install', path2);
  run('pnpm build:registry', path2);
} else {
  console.error(`❌ 错误: 找不到路径 ${path2}`);
}

// 4. 跨平台复制产物
console.log('\n📂 正在同步静态资源...');

const copyTask = [
  { 
    src: 'repos/shadcn-vue/apps/v4/public/r', 
    dest: 'dist/s' 
  },
  { 
    src: 'repos/ai-elements-vue/apps/registry/server/assets/registry', 
    dest: 'dist/a' 
  }
];

copyTask.forEach(task => {
  if (fs.existsSync(task.src)) {
    // Node 16.7+ 支持 cpSync，完美替代 cp -r
    fs.cpSync(task.src, task.dest, { recursive: true, force: true });
    console.log(`✅ 已复制: ${task.src} -> ${task.dest}`);
  } else {
    console.warn(`⚠️ 警告: 源路径不存在，跳过复制: ${task.src}`);
  }
});

console.log('\n✨ 所有构建任务已成功完成！');