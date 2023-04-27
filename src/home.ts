import { View } from '@slack/bolt'
import { OpenHomeArgs } from './type'

export const openHome = async ({ event, client }: OpenHomeArgs) => {
  await client.views.publish({
    user_id: event.user,
    view: {
      ...homeView,
    },
  })
}

export const homeView: View = {
  type: 'home',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'このアプリはBuySellBuddyをSlackで利用できるようにしたものです:sparkles:\n\nBuySellBuddyとは、OpenAI社の先進的なAI技術を活用して、安全に人工知能と会話ができるサービスです。\n\nSlackBuddyを使うことで、あなたは日常的な質問から専門的なトピックまで、幅広い会話をSlack上で手軽に行うことができます。\nたとえば、アイデアのブレインストーミングや情報検索、問題解決のサポートなど、さまざまな目的で活用できます。\nSlackBuddyがあなたにとって最高の相棒となりますように！:sparkles:',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'SlackBuddyの使い方を紹介します。\n',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '\n',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*前提*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'SlackBuddyへの質問は「SlackBuddyとのダイレクトメッセージ」か「チャンネル」で可能です。個人間のダイレクトメッセージで利用する場合はSlackBuddyを招待する必要があります。',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '\n',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*使い方*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*1️⃣ テンプレートを使う方法*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*@BuySellGPT* とメンションします',
      },
    },
    {
      type: 'image',
      image_url:
        'https://storage.googleapis.com/slack-buddy-usage/template-text1.png',
      alt_text: 'inspiration',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*テンプレート一覧を見る* を押下すると質問テンプレートを選択できます。入力ガイドに従って質問してみましょう！',
      },
    },
    {
      type: 'image',
      image_url:
        'https://storage.googleapis.com/slack-buddy-usage/templete-text2.png',
      alt_text: 'inspiration',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '\n',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*2️⃣ 自分の言葉で質問する方法*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*@BuySellGPT* とメンションし、続けて質問文を入力して送信すると、スレッドに回答が返ってきます。テンプレートを使いたくない時はこちらの方法で質問してみましょう！',
      },
    },
    {
      type: 'image',
      title: {
        type: 'plain_text',
        text: 'image1',
        emoji: true,
      },
      image_url:
        'https://storage.googleapis.com/slack-buddy-usage/free-text1.png',
      alt_text: 'image1',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '回答がスレッドに返ってきます。',
      },
    },
    {
      type: 'image',
      title: {
        type: 'plain_text',
        text: 'image1',
        emoji: true,
      },
      image_url:
        'https://storage.googleapis.com/slack-buddy-usage/free-text1.5.png',
      alt_text: 'image1',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'スレッド内では会話の文脈を考慮して返答してくれます。',
      },
    },
    {
      type: 'image',
      title: {
        type: 'plain_text',
        text: 'image1',
        emoji: true,
      },
      image_url:
        'https://storage.googleapis.com/slack-buddy-usage/free-text2.png',
      alt_text: 'image1',
    },
  ],
}
