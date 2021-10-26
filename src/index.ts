import {Command, flags} from '@oclif/command'
import * as puppeteer from 'puppeteer'
import * as chalk from 'chalk'

class Timetrack extends Command {
  static description = 'describe the command here'

  static flags = {
    version: flags.version({char: 'v'}),
    date: flags.string({char: 'd', required: true}),
    hours: flags.integer({char: 'h', required: true}),
    iterate: flags.integer({char: 'i'}),
    help: flags.help({char: 'h'}),
  }

  static args = []

  async run() {
    const {flags} = this.parse(Timetrack)

    const defaultDelay = 1500

    this.log(chalk.green('Registering the tracking hours for BairesDev at ') + chalk.white(flags.date))
    let iterate = flags.iterate || 1
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
    })

    const page = await browser.newPage()

    for (let i = 0; i < iterate; i++) {
      await page.goto('https://timetracker.bairesdev.com/')

      const evalInputHandler = async (id : string, cb: any) => {
        const handlerElement = await page.$(id)
        if (handlerElement) {
          handlerElement
          await handlerElement.evaluate(cb)
        }
      }

      await evalInputHandler('#ctl00_ContentPlaceHolder_UserNameTextBox', (node : any) => node.setAttribute('value', 'kassio.maia'))
      await evalInputHandler('#ctl00_ContentPlaceHolder_PasswordTextBox', (node : any) => node.setAttribute('value', '23112005'))
      await evalInputHandler('#ctl00_ContentPlaceHolder_LoginButton', (node : any) => node.click())

      await new Promise(resolve => {
        setTimeout(async () => {
          await page.goto('https://timetracker.bairesdev.com/TimeTrackerAdd.aspx')

          await new Promise(resolve => {
            setTimeout(async () => {
              await page.evaluate((date, hours) => {
                const formData = new FormData();

                formData.append('ctl00$ContentPlaceHolder$txtFrom', date)
                formData.append('ctl00$ContentPlaceHolder$idProyectoDropDownList', '1099')
                formData.append('ctl00$ContentPlaceHolder$TiempoTextBox', hours)
                formData.append('ctl00$ContentPlaceHolder$idCategoriaTareaXCargoLaboralDropDownList', '19')
                formData.append('ctl00$ContentPlaceHolder$idTareaXCargoLaboralDownList', '783')
                formData.append('ctl00$ContentPlaceHolder$CommentsTextBox', '')
                formData.append('ctl00$ContentPlaceHolder$idFocalPointClientDropDownList', '14213')
                formData.append('ctl00$ContentPlaceHolder$btnAceptar', 'Accept')
                formData.append('ctl00$ContentPlaceHolder$btnAceptar', 'Accept')
                formData.append('ctl00$ContentPlaceHolder$btnAceptar', 'Accept')
                formData.append('ctl00$ContentPlaceHolder$btnAceptar', 'Accept')
                formData.append('__EVENTTARGET', '')
                formData.append('__EVENTARGUMENT', '')
                formData.append('__LASTFOCUS', '')
                formData.append('__VIEWSTATE', '/wEPDwUKMTczMTQzNDY5OQ9kFgJmD2QWAgIDD2QWAgIFD2QWAgIDD2QWAmYPZBYcAgEPDxYCHgdWaXNpYmxlaGQWBgIBDxAPFgQeB0VuYWJsZWRoHwBoZGRkZAIDDw8WAh8AaGRkAgUPDxYCHwBoZGQCBA8WAh4MU2VsZWN0ZWREYXRlBgA4E7MsmNlIZAIFDw8WAh8AaGQWAgIBDw8WAh4EVGV4dGVkZAIGDw8WAh8AaGRkAggPEA8WAh4LXyFEYXRhQm91bmRnZBAVAgASQWRvYmUgLSBBZG9iZSBJbmMuFQIBMAQxMDk5FCsDAmdnZGQCCg8PZA8QFgFmFgEWAh4OUGFyYW1ldGVyVmFsdWUoKVlTeXN0ZW0uSW50NjQsIG1zY29ybGliLCBWZXJzaW9uPTQuMC4wLjAsIEN1bHR1cmU9bmV1dHJhbCwgUHVibGljS2V5VG9rZW49Yjc3YTVjNTYxOTM0ZTA4OQQ1OTQ1FgECBWRkAgwPDxYCHwMFATFkZAIPDxAPFgIfBGdkEBUNDC0tIFNlbGVjdCAtLQdBYnNlbmNlDkFkbWluaXN0cmF0aXZlC0RldmVsb3BtZW50DURvY3VtZW50YXRpb24JSWRsZSB0aW1lEEludGVybmFsIFByb2Nlc3MRTWVldGluZ3MgKENsaWVudCkTTWVldGluZ3MgKEludGVybmFsKQVPdGhlcgdUZXN0aW5nElRyYWluaW5nIChUcmFpbmVlKRJUcmFpbmluZyAoVHJhaW5lcikVDQACMTcCMTgCMTkCMjACMjECMjICMjMCMjQCMjUCMjYCMjcCMjgUKwMNZ2dnZ2dnZ2dnZ2dnZ2RkAhEPD2QPEBYCZgIBFgIWAh8FKCsEATEWAh8FBQQ1OTY2FgICBQIFZGQCEw8QDxYEHwRnHwFnZBAVHgwtLSBTZWxlY3QgLS0XQXJjaGl0ZWN0dXJlIGRlZmluaXRpb24KQnVnIEZpeGluZwtDb2RlIHJldmlldw1Db25maWd1cmF0aW9uDURCIEF1dG9tYXRpb24OREIgTWFpbnRlbmFuY2UFRGVidWcQRGVtbyBwcmVwYXJhdGlvbgpEZXBsb3ltZW50BkRlc2lnbhFFbnZpcm9ubWVudCBzZXR1cBRGZWF0dXJlcyBkZXZlbG9wbWVudA5HcmFwaGljIERlc2lnbgtJbnRlZ3JhdGlvbg9MaWJyYXJ5IFVwZ3JhZGUOTW9ja3VwcyBEZXNpZ24HT24gY2FsbBNPdGhlciAtIERldmVsb3BtZW50C1BlZXIgcmV2aWV3CFJlZmFjdG9yFVJlcXVpcmVtZW50cyBhbmFseXNpcxNSZXNlYXJjaCAvIEFuYWx5c2lzFVJlc2VhcmNoIGFuZCBMZWFybmluZwVTcGlrZQdTdXBwb3J0FlRlc3QgY2FzZXMgZGV2ZWxvcG1lbnQNVUkgZGVmaW5pdGlvbhFXaXJlZnJhbWVzIERlc2lnbhRXcml0aW5nIFVzZXIgU3RvcmllcxUeAAM3NzgDNzg3Azc3OQM3OTUDNzkyAzc5MwM4MDADNzgwAzc4MQM3ODgDNzgyAzc4MwM4MDMDNzk5Azc5NgM4MDIDODAxBDEwMTEDNzkxAzc5NwM3OTADNzg1Azc5NAM3ODYDNzk4Azc4NAM4MDUDODA0Azc4ORQrAx5nZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dkZAIVDw9kDxAWA2YCAQICFgMWAh8FKCsEATEWAh8FBQIxORYCHwUFBDU5NjYWAwIFZgIFZGQCGQ8QDxYCHwRnZBAVBAAKSmFyZWQgS2luZw9KZXJlbXkgQW5kZXJzb24LVHJhY3kgU21pdGgVBAAFMTQyMTMFMTQyMzUFMTQyNTIUKwMEZ2dnZ2RkAhoPD2QPEBYBZhYBFgIfBQUEMTA5ORYBZmRkAhwPDxYCHwNlZGRkJFER6H1CJCa3SHuOjdUoEG183oKG/WcGPba6BssfoO4=')
                formData.append('__LASTFOCUS', '')
                formData.append('__VIEWSTATEGENERATOR', 'E5A749BD')
                formData.append('__EVENTVALIDATION', '/wEdADmkQN259Jj65BQgPibGJpLk4x8AhbDk1OuzysNknnQllt3X1JqGigG7nsR3K2Z9atKjoVn5GI0p/fW1o9EiUaZDfOxWbMR+jpbbgtzS4PPmwIshYDBjI3ie7zA3v+BHt7DyaXwxwFmcSMyTY2nzIBGtSr73MJIeq1OQmlkyzJzRnbLvT0HUIbhAqk2W4z0TbouCIatY87kz8raSLI4GBeKgUHYc9pf2B4KMnkO6K14dvJP46uR5gaEDiUnF3boIScR8IBHym+UzDFJGyTNVFxj/yV0aItv05w4Hk38Z+q2Yez38/LhJdUM6r5/OGdg3wRmNdkhqlBO0Ym/JC+CY2zJEzSy0xRhPU9OO3Ti57RGbGPIq5LDBTanrdI6svq46UdJ4T5IX1ein1tN6JKPsCA6BEDXu4O57vENzHu+DBjEdybFcbe1BKeOYsE56/orAnHNwNrNt+VHbqpVcwZ/MlQPDB62Ut1K5rSWVa5sqims5cmXgwUr+ga7TDGR7/Kno4yFsUiYKeJ8nZWMj2KKFyqxA+6Uncoopikh0PlF/sg1RUwvW/J8RAUndI51/frbcFYLmulyw1bW74a9bDO+sjg06WPbfOk2NSGMfYkZCXLVOrQQ5/ovZ3wNwDwu/NsZXXoo0C577lJb9EI7H7YA4b8HN9EqlYh1GvPuHJLXQqvFJu3dU8rj9YtdOWmF8RBzhk5k8/cPW2/T3UOeuSfpEZIgZBHUiNFDQ4QNUIGAUKBXr/wYWgM7qPAWJHn69/9Bk9oljHdioZspnOuP006CDybrh0UdReCafGVHhawDxTIWNoPNwdtRLjqssYjX7QfNCSOUn3WZnM2NVgsX/G8w2E0554nEVZX5OTNdjCCicC2fnqceeWQ3umf1JQsBc0TG/XrkMC+5oTBqSBombLtp1PRdqnoXxbApCbKXEJTaUQfy8O+jny66Ut+xUvyhp4zfwUb7OMW4K8/LIjbxstGGx+SQUmZgz6A/xBJ4KnqciwG8nIHSeAZe7DRRhYQZPZTzfxzjP5q730f9rc48z6R3WjEP6K/I93HtntluhA9/CrtEsdTpHBhlm5iiFrBwTlRaNr8OllhjxmQECkJ841ht1KYAFc54EpZs1YUIctgObWCFE35cjuAg/oJB2WL5eDAvRa8j7vRAlv/Jfzi5niFsJcPEtOv4xVaY4l3rGrTfvNmMENjznY0dGcOmXiB/tRMQaRhVif9F8X7CCFRpVUCHj0emyKHrWe+8oVhG3ltQ5DFyzPg==')

                // @ts-ignore
                fetch("https://timetracker.bairesdev.com/TimeTrackerAdd.aspx", {
                  "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "max-age=0",
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-ch-ua": "\"Google Chrome\";v=\"95\", \"Chromium\";v=\"95\", \";Not A Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1"
                  },
                  "referrer": "https://timetracker.bairesdev.com/TimeTrackerAdd.aspx",
                  "referrerPolicy": "strict-origin-when-cross-origin",
                  // @ts-ignore
                  "body": new URLSearchParams(formData).toString(),
                  "method": "POST",
                  "mode": "cors",
                  "credentials": "include"
                });
                // @ts-ignore
              }, flags.date, flags.iterate !== undefined ? flags.hours.toString() : 1)

              resolve(true)
            }, defaultDelay)
          })

          resolve(true)
        }, defaultDelay)
      });

    }

    setTimeout(() => {
      this.log(chalk.blue('The hours has been registered on timetracker'))
      browser.close()
    }, defaultDelay)
  }
}

export = Timetrack
