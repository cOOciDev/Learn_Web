const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const loadEnv = () => {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return false;

  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index === -1) return;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
  return true;
};

const describeChat = (chat) => {
  const name = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(' ') || chat.username || 'Unknown';
  const username = chat.username ? ` @${chat.username}` : '';
  return `chat_id=${chat.id} type=${chat.type} name="${name}"${username}`;
};

(async () => {
  if (!loadEnv()) {
    console.error('Missing .env. Create it from .env.example first.');
    process.exit(1);
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error('Missing TELEGRAM_BOT_TOKEN in .env.');
    process.exit(1);
  }

  const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
  const body = await res.json();
  if (!body.ok) {
    console.error(body.description || 'Telegram getUpdates failed.');
    process.exit(1);
  }

  const chats = new Map();
  body.result.forEach((update) => {
    const chat = update.message?.chat || update.channel_post?.chat || update.my_chat_member?.chat;
    if (chat) chats.set(chat.id, chat);
  });

  if (!chats.size) {
    console.log('No chats found. Send /start to the bot from your Telegram account, or add the bot to the target group, then run this again.');
    return;
  }

  [...chats.values()].forEach((chat) => console.log(describeChat(chat)));
})();
