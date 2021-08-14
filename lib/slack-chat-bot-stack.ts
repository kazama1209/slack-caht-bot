import * as cdk from "@aws-cdk/core"
import { Runtime } from "@aws-cdk/aws-lambda"
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs"
import * as apigateway from "@aws-cdk/aws-apigateway"
import * as ssm from "@aws-cdk/aws-ssm"
import * as dotenv from "dotenv"

dotenv.config()

export class SlackChatBotStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // パラメータストアからSLACK_BOT_TOKENを取得
    const slackBotToken = ssm.StringParameter.fromStringParameterAttributes(this, "channelAccessToken", {
      parameterName: "/slack-chat-bot/SLACK_BOT_TOKEN",
    }).stringValue

    // パラメータストアからSLACK_SIGNING_SECRETを取得
    const slackSigningSecret = ssm.StringParameter.fromStringParameterAttributes(this, "slackSigningSecret", {
      parameterName: "/slack-chat-bot/SLACK_SIGNING_SECRET",
    }).stringValue

    // Lambda関数
    const lambdaFunction = new NodejsFunction(this, "lambdaFunction", {
      functionName: "slack-chat-bot", // 関数名
      entry: "src/App.ts",            // ファイル
      handler: "handler",             // 実行する関数
      runtime: Runtime.NODEJS_14_X,   // ランタイム（言語）
      environment: {                  // 環境変数
        SLACK_BOT_TOKEN: slackBotToken || process.env.SLACK_BOT_TOKEN || "",
        SLACK_SIGNING_SECRET: slackSigningSecret || process.env.SLACK_SIGNING_SECRET || "",
      },
    })

    // API Gateway
    new apigateway.LambdaRestApi(this, "apigateway", {
      handler: lambdaFunction,
    })
  }
}
