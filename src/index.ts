import { app } from './app'
import { appMention } from './mention'
import { openSearchModal, submitSearchPrompt } from './modals/search'
import {
  openSpreadsheetModal,
  submitSpreadsheetPrompt,
} from './modals/spreadsheet'
import {
  openSummarizeGistModal,
  submitSummarizeGistPrompt,
} from './modals/summarize_gist'
import { openSummarizeModal, submitSummarizePrompt } from './modals/summarize'
import { openSqlModal, submitSqlPrompt } from './modals/sql'
import { openGasModal, submitGasPrompt } from './modals/gas'
import {
  openTranslationModal,
  submitTranslationPrompt,
} from './modals/translation'
import {
  openEnglishTranslationModal,
  submitEnglishTranslationPrompt,
} from './modals/english_translation'
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

app.action('open_search_modal_button', openSearchModal)
app.view('search_modal', submitSearchPrompt)

app.action('open_spreadsheet_modal_button', openSpreadsheetModal)
app.view('spreadsheet_modal', submitSpreadsheetPrompt)

app.action('open_summarize_gist_modal_button', openSummarizeGistModal)
app.view('summarize_gist_modal', submitSummarizeGistPrompt)

app.action('open_summarize_modal_button', openSummarizeModal)
app.view('summarize_modal', submitSummarizePrompt)

app.action('open_sql_modal_button', openSqlModal)
app.view('sql_modal', submitSqlPrompt)

app.action('open_gas_modal_button', openGasModal)
app.view('gas_modal', submitGasPrompt)

app.action('open_translation_modal_button', openTranslationModal)
app.view('translation_modal', submitTranslationPrompt)

app.action('open_english_translation_modal_button', openEnglishTranslationModal)
app.view('english_translation_modal', submitEnglishTranslationPrompt)
