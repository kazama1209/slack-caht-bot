#!/usr/bin/env node
import "source-map-support/register"
import * as cdk from "@aws-cdk/core"
import { SlackChatBotStack } from "../lib/slack-chat-bot-stack"

const app = new cdk.App()
new SlackChatBotStack(app, "SlackChatBotStack", {})
