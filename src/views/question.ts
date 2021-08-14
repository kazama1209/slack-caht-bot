import { View } from "@slack/bolt"

// 質問を投げるビュー
export const question: View = {
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
        text: "どの動物について知りたいですか？",
        verbatim: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "actions",
      elements: [
        {
          type: "static_select",
          action_id: "select-option",
          placeholder: {
            type: "plain_text",
            text: "選択してください",
            emoji: true,
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "イヌについて",
                emoji: true,
              },
              value: "dog",
            },
            {
              text: {
                type: "plain_text",
                text: "ネコについて",
                emoji: true,
              },
              value: "cat",
            },
            {
              text: {
                type: "plain_text",
                text: "ウサギについて",
                emoji: true,
              },
              value: "rabbit",
            },
          ],
        },
      ],
    },
  ]
}
