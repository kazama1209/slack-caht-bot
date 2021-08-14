import { View } from "@slack/bolt"

// 「ウサギ」が選ばれた場合に返すビュー
export const rabbit: View = {
  type: "modal",
  title: {
    type: "plain_text",
    text: "Slack Chatbot",
    emoji: true,
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "ウサギについて",
        verbatim: true,
      },
      accessory: {
        type: "button",
        action_id: "select-option-reset",
        text: {
          type: "plain_text",
          text: "戻る",
          emoji: true,
        },
      },
    },
    {
      type: "divider",
    },
    {
      type: "image",
      alt_text: "ウサギについて",
      image_url:
      "https://www.pakutaso.com/shared/img/thumb/USAGI0I9A6075_TP_V.jpg",
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        verbatim: true,
      },
    },
  ]
}
