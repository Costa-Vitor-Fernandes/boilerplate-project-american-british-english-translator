const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const _ = require("lodash");

class Translator {
    constructor(){
        this.getLocaleObjs =this.getLocaleObjs.bind(this)
        this.spliter = this.spliter.bind(this)  
        this.colorizer  = this.colorizer.bind(this)
        this.wordChecker = this.wordChecker.bind(this)
        this.translate = this.translate.bind(this)
        this.timeChecker = this.timeChecker.bind(this)
    }

    getLocaleObjs(locale) {
        console.log('locale')
        if(locale === 'american-to-british'){
            //Should i return _.invert(britishOnly) here too?
           return {...americanToBritishTitles,...americanOnly,...americanToBritishSpelling}
        // americanOnly + american to british spelling and titles
        }
        if(locale === 'british-to-american'){
            //Should i return _.invert(americanOnly) here too?
            let invertedSpelling = _.invert(americanToBritishSpelling)
            let invertedTitles = _.invert(americanToBritishTitles)
            let fullObj = {...britishOnly, ...invertedSpelling, ...invertedTitles};
            return fullObj
            // britishOnly + british to american spelling and titles
        }
        else{
           return { error: 'Invalid value for locale field' }
        }
    }
    spliter(inputText){
        let result = inputText.split(' ')
        let lastWord = result[result.length-1]
        if(lastWord.includes('.') && lastWord[lastWord.length-1] === '.'){
            console.log("dot included in this last word",result[result.length-1])
            console.log(lastWord[lastWord.length-1], 'this should be the dot')
            //todo: remove the dot at the end and return
        }
        return result
    }
    wordChecker(splitText, localeDic){

        let dic = Object.keys(localeDic)
        let newText ;
        let returnObj = {
            from:[],
            to:[]
        }
        splitText.forEach((v,i,arr)=>{
            if(dic.includes(v.toLowerCase())){
                console.log('it includes one word ! index:', i , 'translated word', this.colorizer(localeDic[v]))
                returnObj.from.push(v)
                returnObj.to.push(localeDic[v])
            }
            let twoWords = arr[i]+ " " + arr[i+1]
            if(dic.includes(twoWords.toLowerCase())){
                console.log('it includes two words ! index:', i , 'translated word', this.colorizer(localeDic[twoWords]))
                returnObj.from.push(twoWords)
                returnObj.to.push(localeDic[twoWords])
            }
            let threeWords = arr[i] + " " + arr[i+1] + " " + arr[i+2]
            if(dic.includes(threeWords.toLowerCase())){
                console.log('it includes three words ! index:', i , 'translated word', this.colorizer(localeDic[threeWords]))
                returnObj.from.push(threeWords)
                returnObj.to.push(localeDic[threeWords])
            }
        })
        // console.log('returnObj', returnObj)
        return returnObj


    }

    colorizer(text){
        let result = `<span class="highlight">${text}</span>`
        return result
    }
    timeChecker(splitText, locale){
        splitText.map((v,i,arr)=>{
            let regex = /\d\.?\:?/gm
            let found = v.match(regex)
            if(found.length === v.length){
                //TODO: this should be a time, and should be converted
                //use replace()
            }
        })

    }
    timeTranslate(time){
        //TODO : replace() and return time 
    }
    translate(inputText, locale){
        if(!inputText){
            return { error: 'No text to translate' }
        }
        if(!locale){
            return { error: 'Invalid value for locale field' }
        }
        let splitText = this.spliter(inputText)
        let localeDic = this.getLocaleObjs(locale)

        let result = this.wordChecker(splitText,localeDic)
        console.log(result,'log of wordchecker')
        let translatedText = inputText;

        result.from.forEach((v,i,arr)=>{
           translatedText = translatedText.replace(result.from[i],this.colorizer(result.to[i]))
        })
        console.log('translatedText:',translatedText, 'original text', inputText)

        

        if(translatedText === inputText){
            return "Everything looks good to me!"
        }
        return translatedText



    }
}

module.exports = Translator;