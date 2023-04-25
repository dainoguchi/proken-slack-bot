import { app } from './app'
import { appMention } from './mention'
import { openEmailModal, submitEmailPrompt } from './modals/email'
import { openSearchModal, submitSearchPrompt } from './modals/search'
import { openSummarizeModal, submitSummarizePrompt } from './modals/summarize'
import { openTemplateModal } from './modals/template'
import { addPingCommand } from './command'

;(async () => {
  // アプリを起動します
  await app.start()
  console.log('⚡️ Bolt app is running!')
})()

addPingCommand(app)

app.message(process.env.SLACK_BOT_USER_ID, appMention)
app.action('open_template_modal_button', openTemplateModal)

app.action('open_email_modal_button', openEmailModal)
app.view('email_modal', submitEmailPrompt)

app.action('open_search_modal_button', openSearchModal)
app.view('search_modal', submitSearchPrompt)

app.action('open_summarize_modal_button', openSummarizeModal)
app.view('summarize_modal', submitSummarizePrompt)
