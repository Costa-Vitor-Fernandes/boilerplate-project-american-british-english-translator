const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const _ = require("lodash");
const { capitalize } = require('lodash');

class Translator {
    constructor(){
        this.getLocaleObjs =this.getLocaleObjs.bind(this)
        this.spliter = this.spliter.bind(this)  
        this.colorizer  = this.colorizer.bind(this)
        this.wordChecker = this.wordChecker.bind(this)
        this.translate = this.translate.bind(this)
        this.splitWordsByPunctuation = this.splitWordsByPunctuation.bind(this)
        this.translateAndColor = this.translateAndColor.bind(this)
        this.timeTranslate = this.timeTranslate.bind(this)
        this.testTranslateAndColor = this.testTranslateAndColor.bind(this)
    }

    getLocaleObjs(locale) {
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
        return result
    }
    wordChecker(splitText, locale, localeDic){
        let dic = Object.keys(localeDic)
        let newText ;
        let returnObj = {
            from:[],
            to:[]
        }
        splitText.forEach((v,i,arr)=>{
            let threeWords = arr[i] + " " + arr[i+1] + " " + arr[i+2]
            let twoWords = arr[i]+ " " + arr[i+1]
            if(dic.includes(threeWords.toLowerCase())){
                console.log('it includes three words ! index:', i , 'translated word', this.colorizer(localeDic[threeWords]))
                returnObj.from.push(threeWords)
                returnObj.to.push(localeDic[threeWords.toLowerCase()])
            }
            else if(dic.includes(twoWords.toLowerCase())){
                console.log('it includes two words ! index:', i , 'translated word', this.colorizer(localeDic[twoWords]))
                returnObj.from.push(twoWords)
                returnObj.to.push(localeDic[twoWords.toLowerCase()])
            }
            else if(dic.includes(v.toLowerCase())){
                console.log('it includes one word ! index:', i , 'translated word', this.colorizer(localeDic[v.toLowerCase()]))
                
                let americanTitles = Object.keys(americanToBritishTitles)
                let britishTitles = Object.keys(_.invert(americanToBritishTitles))

                if(americanTitles.includes(v.toLowerCase()) || britishTitles.includes(v.toLowerCase())){
                    returnObj.from.push(v)
                    let upperCaseTitle = _.capitalize(localeDic[v.toLowerCase()])
                    returnObj.to.push(upperCaseTitle)
                }
                else{   
                    returnObj.from.push(v)
                    returnObj.to.push(localeDic[v.toLowerCase()])
                }
            }
            let regex = /\d\.?\:?/gm
            let timeFound = v.match(regex)
            if(timeFound){
                //if time is found , should it be colored anyway ? supposedly
                let time = timeFound.join('')
                console.log('a time here:',time)
                returnObj.from.push(time)
                returnObj.to.push(this.timeTranslate(time, locale))
                //TODO: this should be a time, and should be converted
                //use replace()
            }
        })
        // console.log('returnObj', returnObj)
        return returnObj
    }
    splitWordsByPunctuation(splitText){

       let dottedWords =  Object.keys(americanToBritishTitles)
        let symbols = ['.','!','?',';',',']
        let result = splitText
        splitText.forEach((word,i,arr)=>{
            let lastIndexOfThisWord = word[word.length-1]
            let cleanWord = word.substring(0,word.length-1)
            //if this is not a title
            if(!dottedWords.includes(word.toLowerCase())){
            if(symbols.includes(lastIndexOfThisWord)){
                console.log("dot included in this word:",cleanWord, 'the dot:',lastIndexOfThisWord)
                result.pop()
                result.push(cleanWord, lastIndexOfThisWord)
            } 
            }
            
        })
        return result

        // if(symbols.includes(lastIndexOfLastWord)){
        //     let word = result[result.length-1]
        //     console.log("dot included in this last word",word)
        //     console.log(lastWord[lastWord.length-1], 'this should be the dot')
            
        //     console.log('word:', word.substring(0,word.length-1))
        //     console.log('the dot on the final :', lastWord[lastWord.length-1] )
        //     //todo: remove the dot at the end and return
        //     result.pop()
        //     result.push(word.substring(0,word.length-1), lastWord[lastWord.length-1] )
        //     return result
        // }
        
    }
    colorizer(text){
        let result = `<span class="highlight">${text}</span>`
        return result
    }
    timeTranslate(time, locale){
        console.log('time translation original:', time)
       if(time.includes('.') && locale ==="british-to-american" ){ 
         return(time.replace(".",":"))
       }
       else if(time.includes(":") && locale ==="american-to-british"){ 
        return (time.replace(":","."))
       }
       else{
           return time
        }
    }
    //actual answer to api
    translateAndColor(inputText,locale){
        let possibleLocales = ['american-to-british', 'british-to-american']
        if(!inputText || inputText === ""|| inputText === undefined){
            if(!locale || locale==="" || locale === undefined){
                return  { error: 'Required field(s) missing' } 
            }
            if(inputText === "") return { error: 'No text to translate' }
        }
        if(!possibleLocales.includes(locale) || !locale){
            return { error: 'Invalid value for locale field' }
        }
        if(!locale || !inputText || locale === undefined || inputText === undefined){
            return  { error: 'Required field(s) missing' }  
        }
        let splitText = this.spliter(inputText)
        let splitWordsByPunctuation = this.splitWordsByPunctuation(splitText)
        let localeDic = this.getLocaleObjs(locale)
        // let timeChecker = this.timeChecker(splitText)
        // console.log(timeChecker)

        let result = this.wordChecker(splitWordsByPunctuation,locale,localeDic)
        console.log(result,'log of wordchecker')
        let translatedText = inputText;

        result.from.forEach((v,i,arr)=>{
           translatedText = translatedText.replace(result.from[i],this.colorizer(result.to[i]))
        //    translatedText = translatedText.replace(result.from[i],result.to[i])
        })
        console.log('translatedText:',translatedText, 'original text', inputText)
        
        

        if(translatedText === inputText){
            return {text:inputText ,translation:"Everything looks good to me!"}
        }   
        return {text: inputText, translation: translatedText}



    }
    //only for testing purposes
    translate(inputText, locale){
        let possibleLocales = ['american-to-british', 'british-to-american']
        if(!inputText || inputText === ""){
            return { error: 'No text to translate' }
        }
        if(!possibleLocales.includes(locale) || !locale){
            return { error: 'Invalid value for locale field' }
        }
        if(!locale && !inputText){
            return  { error: 'Required field(s) missing' }  
        }
        let splitText = this.spliter(inputText)
        let splitWordsByPunctuation = this.splitWordsByPunctuation(splitText)
        let localeDic = this.getLocaleObjs(locale)
        // let timeChecker = this.timeChecker(splitText)
        // console.log(timeChecker)

        let result = this.wordChecker(splitWordsByPunctuation,locale,localeDic)
        console.log(result,'log of wordchecker')
        let translatedText = inputText;

        result.from.forEach((v,i,arr)=>{
        //    translatedText = translatedText.replace(result.from[i],this.colorizer(result.to[i]))
           translatedText = translatedText.replace(result.from[i],result.to[i])
        })
        console.log('translatedText:',translatedText, 'original text', inputText)

        

        if(translatedText === inputText){
            return "Everything looks good to me!"
        }   
        return translatedText



    }
    //only for testing purposes
    testTranslateAndColor(inputText,locale){
        let possibleLocales = ['american-to-british', 'british-to-american']
        if(!inputText || inputText === ""){
            return { error: 'No text to translate' }
        }
        if(!possibleLocales.includes(locale) || !locale){
            return { error: 'Invalid value for locale field' }
        }
        if(!locale && !inputText){
            return  { error: 'Required field(s) missing' }  
        }
        let splitText = this.spliter(inputText)
        let splitWordsByPunctuation = this.splitWordsByPunctuation(splitText)
        let localeDic = this.getLocaleObjs(locale)
        // let timeChecker = this.timeChecker(splitText)
        // console.log(timeChecker)

        let result = this.wordChecker(splitWordsByPunctuation,locale,localeDic)
        console.log(result,'log of wordchecker')
        let translatedText = inputText;

        result.from.forEach((v,i,arr)=>{
           translatedText = translatedText.replace(result.from[i],this.colorizer(result.to[i]))
        //    translatedText = translatedText.replace(result.from[i],result.to[i])
        })
        console.log('translatedText:',translatedText, 'original text', inputText)

        

        if(translatedText === inputText){
            return "Everything looks good to me!"
        }   
        return translatedText
    }
    //only for testing purposes
}

module.exports = Translator;