import * as dotenv from "dotenv"

import {
  App,
  ExpressReceiver,
  BlockAction,
} from "@slack/bolt"
import { LogLevel } from "@slack/logger"

import * as awsServerlessExpress from "aws-serverless-express"
import { APIGatewayProxyEvent, Context } from "aws-lambda"

// 各種ビュー部分
import {
  question,
  dog,
  cat,
  rabbit
} from "./views"

dotenv.config()

// これを設定する事により3秒以内に処理を完了できる前提でLambda環境における正常な動作が保証される
const processBeforeResponse = true

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? "",
  processBeforeResponse,
})

// 初期設定
const app = new App({
  logLevel: LogLevel.DEBUG,
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: expressReceiver,
  processBeforeResponse,
})

// aws-serverless-expressによってプロキシ
const server = awsServerlessExpress.createServer(expressReceiver.app)
export const handler = (
  event: APIGatewayProxyEvent,
  context: Context
): void => {
  awsServerlessExpress.proxy(server, event, context)
}

// スラッシュコマンド「/animals」が実行された際の処理
app.command("/animals", async ({ ack, client, payload }) => {
  await ack()

  // 質問用のモーダル画面を表示
  await client.views.open({
    trigger_id: payload.trigger_id,
    view: question,
  })
})

// action_id = select-optionのアクションが実行された際の処理（今回で言えば選択肢を選んだ際）
app.action<BlockAction>("select-option", async ({ ack, client, action, body, logger }) => {
  await ack()

  if (typeof body.view !== "undefined" && action.type === "static_select") {
    const selectedOption: string = action.selected_option.value

    // 選択肢によって返すビューを変更
    const answer = (selectedOption: string) => {
      switch (selectedOption) {
        case "dog":    // イヌの場合
          return dog
        case "cat":    // ネコの場合
          return cat
        case "rabbit": // ウサギの場合
          return rabbit
        default:
          return question
      }
    }
  
    // 選択肢に合わせてモーダル画面を更新
    await client.views.update({
      view_id: body.view.id,
      view: answer(selectedOption),
    })

  } else {
    logger.info(`Skipped because the button 'select-option' is not placed in a modal: ${JSON.stringify(action)}`)
  }
})

// action_id = select-option-resetのアクションが実行された際の処理（今回で言えば戻るボタンを押した際）
app.action<BlockAction>("select-option-reset", async ({ ack, body, client }) => {
  await ack()

  if (typeof body.view !== "undefined") {
    // モーダル画面を更新（最初の質問に戻す）
    await client.views.update({
      view_id: body.view.id,
      view: question,
    })
  }  
})

// ローカル環境においては通常起動
if (process.env.IS_LOCAL === "true") {
  void (async () => {
    await app.start(process.env.PORT || 3000)
    console.log("⚡️ Bolt app is running!")
  })()
}
