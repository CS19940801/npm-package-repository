import axios from 'axios'
import arrTrans from './shudu'

function getQ(Num) {

    let num = Num || 1

    axios.get(`/api/getQuestions?group=JS2&quantity=${num}`).then(Response => {
        console.log(`----get----`, new Date().getTime() - time);
        let res = Response.data
        // console.log(res);
        let questionDOList = res.questionDOList
        let submit = {
            "recordId": res.recordId,
            "questionDOS": [
                // {
                //     "questionId": qid,
                //     "answer": calShudu(question)
                // }, {
                //     "questionId": 14630,
                //     "answer": "061934825354628197928157634219546378483279516576381942195762483832495761647813259"
                // }
            ]
        }
        console.log(questionDOList, new Date());
        questionDOList.forEach(val => {
            submit.questionDOS.push({ questionId: val.questionId, answer: arrTrans(val.question).join('').split(',').join('') })
        });
        submit.recordId = res.recordId
        console.log(`----get&cal&reset----`, new Date().getTime() - time);
        sbmitQ(submit)
    })
}
function sbmitQ(parmas) {
    let param = parmas || {
        "recordId": "12",
        "questionDOS": [
            {
                "questionId": "149",
                "answer": "215348679346579128789612435124795386893164257567823941972456813431987562658231794"
            }
        ]
    }
    axios.post('/api/answerRecord/submit', param).then(res => {
        console.log(`oktime`, new Date().getTime() - time);
    })
}
let time = new Date().getTime()
getQ(1)

export default getQ