'use strict';

// 六个主题来自大麦哥的视频；题目和分析提示是这份练习的延伸。
const TOPICS = [
  {
    name:'独立', title:'恋爱以后，也保留自己的生活',
    perspective:'一段关系很重要，你自己的朋友、兴趣和打算也很重要。即使关系后来结束，曾经的陪伴和成长仍有意义。',
    question:'对方想和你相处，但你已经有别的安排时，你通常会怎么做？',
    options:[
      {label:'一起商量时间，也尽量保留自己的安排。',insight:'你比较愿意同时照顾两个人的需要。能商量，是保持亲近又保留自己生活的一种办法。',action:'遇到一次时间冲突时，说清哪件事对你重要，再一起找合适的时间。'},
      {label:'先取消自己的安排，怕对方不高兴。',insight:'你可能很在意对方是否失望。如果总靠让步维持亲近，时间久了也可能觉得委屈。',action:'从一件小事开始，试着说：“我也很想陪你，不过这次安排对我很重要，我们可以换个时间一起相处。”'},
      {label:'先按自己的安排来，但不知道怎么和对方说。',insight:'你很在意自己的生活和决定。怎样让对方听懂你的考虑，可能比是否让步更值得练习。',action:'先解释你的打算，再问问对方希望怎么安排。'},
      {label:'还不确定，或者没有遇到过。',insight:'这一点还没有明确答案。可以先给自己的朋友、兴趣和日常安排留一点位置，在相处中慢慢观察。',action:'选一项你想继续保留的兴趣、友谊或个人安排。'}
    ],
    prompts:['恋爱以后，你还想保留哪些属于自己的事？为什么？','假如你约了朋友周末见面，对方临时想让你留下陪伴。你会怎么做、怎么说？','一段重要的关系，曾给你留下哪些好的影响或改变？'],
    placeholders:['例如：和朋友见面、独处、学习、工作或一项爱好。','可以写第一反应，再写你实际上可能怎么处理。','没有相关经历，可以写你希望未来得到怎样的陪伴。']
  },
  {
    name:'空间',title:'分开一会儿，也能安心',
    perspective:'想一个人待一会儿，不一定是不爱对方。说清楚需要多久、什么时候再联系，可能让两个人都轻松些。',
    question:'对方说想一个人安静一会儿时，你通常更接近哪种反应？',
    options:[
      {label:'可以理解，也会商量什么时候再联系。',insight:'你比较能接受暂时分开，也重视保持联系。把联系时间说清楚，有助于减少彼此的猜测。',action:'聊聊各自需要多少独处时间，以及怎样联系会舒服。'},
      {label:'会不安，担心对方不在乎我了。',insight:'距离可能容易让你想到“不被重视”。这更能说明你希望被在意，还不能说明对方是否不爱你。',action:'把担心说成一个具体请求，例如：“你忙完后告诉我一声，我会安心些。”'},
      {label:'我自己也需要空间，但常常直接不回复。',insight:'暂时不回复可能是在给自己留空间，但对方未必知道你会不会再回来。提前说明可能减少误会。',action:'试着说：“我想先安静一会儿，今晚我们再聊。”'},
      {label:'还不确定，不同情况下反应也不同。',insight:'你需要多少距离，可能会随人和情况改变。先找到让自己舒服的联系方式，比急着定性更有用。',action:'回想一次彼此相处很舒服的经历，看看当时怎样联系。'}
    ],
    prompts:['什么时候你最想一个人待一会儿？一般需要多久？','你发消息后，对方说今天想独处，晚些时候联系。你会怎么想、怎么回复？'],
    placeholders:['例如：工作很累、心情不好，或想专心做自己的事。','也可以写你希望对方怎样说，才比较安心。']
  },
  {
    name:'付出',title:'愿意付出，也能说出自己的需要',
    perspective:'付出可以出于喜欢，也可能带着没有说出口的期待。想得到回应很正常，长期委屈时也可以提出调整。',
    question:'你做了很多，却没得到想要的回应时，通常会怎么做？',
    options:[
      {label:'把自己的期待说出来，一起商量。',insight:'你愿意把期待摆到明面上。两个人知道彼此希望得到什么，才更容易判断怎样回应合适。',action:'把“你要更关心我”换成一件对方能听懂、能讨论的小事。'},
      {label:'继续做，但把委屈憋在心里。',insight:'你可能希望对方能主动看见你的用心。一直忍着时，对方可能不知道你已经累了，你也可能越做越委屈。',action:'选一件让你疲惫的事，说清希望对方分担什么。'},
      {label:'反复比较谁做得更多，越想越难受。',insight:'反复比较的背后，可能是希望自己的用心被认真对待。先说清最缺少哪种回应，可能比继续算多少更有帮助。',action:'想一件最介意的事，写下你当时真正希望得到什么回应。'},
      {label:'还不确定，或者没有遇到过。',insight:'你还在了解自己愿意付出到什么程度。喜欢一个人，也可以有不愿勉强自己的事。',action:'想想哪些事你做得心甘情愿，哪些事会让你感到吃力。'}
    ],
    prompts:['对方做什么，会让你觉得自己的付出被重视？','你帮对方忙了几周，对方却说没感受到你的关心。你会怎么理解、怎么聊？'],
    placeholders:['例如：说谢谢、主动分担、认真陪伴，或实际帮你一次。','可以写你的感受，以及下一次想怎样调整。']
  },
  {
    name:'沟通',title:'有分歧时，把话说清楚',
    perspective:'相爱不代表自动懂对方。平时可以聊未来怎么生活，有分歧时也需要表达、倾听和适当暂停。前提是彼此尊重、能安全地说话。',
    question:'和对方闹不愉快时，你通常会怎么做？',
    options:[
      {label:'找合适的时候说出来，也听对方怎么想。',insight:'你愿意靠交谈解决问题。除了能说出来，还可以留意两个人是否都被听懂了。',action:'先用一句话确认对方的意思，再表达自己的感受和希望。'},
      {label:'先不说，希望对方自己发现。',insight:'你可能希望不必解释，也能被对方理解。这种期待很常见，但沉默容易让真正的需要一直没被听见。',action:'从“这件事让我有点难受，我希望……”开始，提出一个具体请求。'},
      {label:'容易马上争起来，之后才想明白。',insight:'你可能很想尽快把问题说清，但情绪上来时，谈话容易变成互相防备。暂停后再谈也能是在认真处理。',action:'约好暂停多久、什么时候再聊，避免谈话一直没有下文。'},
      {label:'不敢说，或者担心说了会被威胁、羞辱。',insight:'你担心的是能不能安全地表达。遇到威胁或羞辱时，先照顾自己的安全，比勉强把话说清更重要。',action:'先联系可信任的人寻求支持，不必独自在不安全的情况下继续谈。'}
    ],
    prompts:['有什么心里话，你一直想让对方听懂？','争执时你想马上谈清楚，对方想先暂停。你会怎么处理，之后怎么继续聊？','关于花钱、家庭或未来生活，你最想和对方聊清楚什么？'],
    placeholders:['可以试着写：“发生这件事时，我觉得……我希望……”','可以写愿意暂停多久，以及你希望怎样约好再聊。','可以写已有的共识，或还没有聊过的事。']
  },
  {
    name:'吸引',title:'相处久了，仍然愿意靠近',
    perspective:'熟悉以后，人和兴趣仍会改变。继续了解彼此、照顾自己的生活，也可以让相处有新鲜感。亲密接触需要双方都愿意。',
    question:'相处久了，你们的状态更接近哪一种？',
    options:[
      {label:'仍愿意了解彼此，也保留各自的兴趣。',insight:'你愿意持续认识对方，也保留自己的生活。这能给两个人带来新的话题和相处机会。',action:'找个轻松的时间，聊聊最近喜欢什么、期待什么。'},
      {label:'忙着过日子，想靠近却不知道怎么开始。',insight:'你想要亲近，但日常事务可能挤掉了相处时间。缺少机会，不一定就等于感情变淡。',action:'留一小段只用来相处的时间，不讨论家务、任务或待办。'},
      {label:'怕对方不再喜欢我，经常委屈自己去配合。',insight:'你可能把很多精力用在维持对方的喜欢上。可以留意：这些改变让你更开心，还是越来越不像自己？',action:'保留一件你自己真心喜欢的事，看看不事事配合时最担心什么。'},
      {label:'还不确定，或者没有长期相处的经历。',insight:'你还没有明确的长期相处经验。可以先想象自己希望怎样被珍惜，也怎样保留自己的生活。',action:'写下一种既自在、又能感到亲近的相处方式。'}
    ],
    prompts:['对方做什么时，你会觉得自己被喜欢、被欣赏？','最近你们聊天几乎只剩生活琐事。你会怎样提议，让两个人重新了解彼此？','亲密接触中，哪些方式让你舒服，哪些希望对方先问过你？'],
    placeholders:['可以是对方的一句话、一个行动，或认真听你说话。','例如：一起散步、聊最近的心情，或尝试一件小事。','只写愿意分享的部分，也可以跳过。']
  },
  {
    name:'选择',title:'听听别人的意见，再做自己的决定',
    perspective:'亲友的建议可以参考，也需要和你真实的经历对照。如果他们指出了具体的不尊重或伤害，值得认真了解。',
    question:'家人或朋友不看好你的关系时，你通常会怎么做？',
    options:[
      {label:'先听理由，再结合自己的经历判断。',insight:'你愿意听建议，也保留自己的判断。分清别人看到了什么、猜测了什么，有助于做出自己的选择。',action:'挑一条建议，分别写下具体发生的事和你自己的感受。'},
      {label:'容易被各种意见影响，越来越拿不定主意。',insight:'你可能很希望做出让人放心的选择。意见越多时，先弄清自己最在意什么，可能比继续询问更多人更有用。',action:'先写下你最在意的两件事，再找一位信任的人聊具体情况。'},
      {label:'基本不听，只想按自己的想法决定。',insight:'你很重视自己做决定。同时也可以看看，亲友是否提醒了某件你还没留意到的具体事情。',action:'选一条不赞同的建议，先核对其中可确认的事情，再决定是否采纳。'},
      {label:'还不确定，或者没有遇到过。',insight:'你还在摸索怎样听取意见。可以先想想什么样的帮助会让你觉得被尊重。',action:'想一个你愿意商量的人，以及你希望对方怎样帮助你。'}
    ],
    prompts:['选择一段关系时，你最看重什么？哪些事不能接受？','家人不赞同这段关系，并提到对方做过不尊重你的事。你感受很复杂，会先做什么？'],
    placeholders:['例如：安全、信任、尊重、未来生活的想法。','可以写怎么问清发生了什么、怎么看自己的感受、想找谁帮忙。']
  }
];
const JUDGMENTS=[
  {statement:'即使怕对方失望，我也能说出自己的重要安排。',notes:['你觉得自己能够开口表达，这可以帮助两个人一起商量。','你觉得开口不容易，可以先想想最怕对方有什么反应。','你还不确定，可以从下一次小事中观察。']},
  {statement:'我们想要的独处时间不一样时，我能说清怎样联系才安心。',notes:['你愿意商量联系的方式，可以继续看看实际是否舒服。','安心的联系办法还没说清，可以从一个具体约定开始。','可以先留意自己什么时候最容易安心或不安。']},
  {statement:'做得太累时，我能说出自己不想再做什么。',notes:['你觉得自己能说出承受范围，也可以看对方是否认真对待。','你可能会先忍着，自己的感受也需要被听见。','可以先找出一件已经让你感到吃力的事。']},
  {statement:'意见不同时，在安全的情况下，我能说出感受，也让对方说完。',notes:['你愿意表达和倾听，可以再看看彼此是否真正听懂。','说出来或听完并不容易，先找出谈话最容易卡住的地方。','可以从一次具体的分歧，看看双方是怎样交谈的。']},
  {statement:'我愿意了解对方的变化，也给自己的兴趣留时间。',notes:['你希望同时照顾自己和关系，可以看看双方是否都感受到。','忙碌或疲惫可能占掉了这部分时间，可以先找一个小空隙。','可以想想最近一次觉得相处有意思是什么时候。']},
  {statement:'听到建议时，我能分清发生过的事、别人的猜测和自己的感受。',notes:['你愿意核对事情，也留意自己的感受，这能帮助你判断。','别人的意见可能让你难以判断，先问清具体发生了什么。','可以先拿一条具体建议，试着分开看这三部分。']}
];
TOPICS.forEach((topic,i)=>{topic.judgment=JUDGMENTS[i];});
const JUDGMENT_LABELS=['符合','不符合','不确定'];
const PARTNER_QUESTIONS=[
  '你在意的这个人，最近在为什么事烦恼？',
  '对方最近最期待什么事？',
  '对方很累时，吃什么可能会开心一点？',
  '你觉得对方现在最怕失去什么？',
  '你觉得对方最想改变生活中的哪件事？'
];

const STORAGE_KEY='aiyu-women-open-v1';
// 密钥只放在本页内存，绝不写入回答存档、分享内容或网址。
let sessionApiKey='';
let selectedModel='gpt-6.1-sol';
let analysisAbort=null;
class AnalysisError extends Error {}
const panel=document.querySelector('#panel');
const nav=document.querySelector('#step-nav');
const saveIndicator=document.querySelector('#save-indicator');
let current=0;
let showingResults=false;
let partnerAnswers=PARTNER_QUESTIONS.map(()=>'');
let includeNotes=false;
let includeAi=false;
let aiAnalysis='';
let aiModel='';
let aiRevision=0;
const CURRENT_ANALYSIS_REVISION=3;
let aiReasoningEffort='';
let analysisFormat=2;
let mbtiType='';
const MBTI_TYPES=['ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP','ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ'];
let aiConsent=false;
let aiBusy=false;
let aiStatus='';
let answerRevision=0;
let saveAvailable=true;
let toastTimer;
const emptyAnswers=()=>TOPICS.map(()=>({choice:null,judgment:null,a:'',b:'',c:''}));
let answers=emptyAnswers();

try {
  const raw=localStorage.getItem(STORAGE_KEY);
  if(raw){
    const parsed=JSON.parse(raw);
    if(typeof parsed.aiAnalysis==='string') aiAnalysis=parsed.aiAnalysis.slice(0,16000);
    if(typeof parsed.aiModel==='string')aiModel=parsed.aiModel.slice(0,120);
    if(Number.isInteger(parsed.aiRevision))aiRevision=parsed.aiRevision;
    if(typeof parsed.aiReasoningEffort==='string')aiReasoningEffort=parsed.aiReasoningEffort.slice(0,20);
    analysisFormat=parsed.analysisFormat===2?2:1;
    if(MBTI_TYPES.includes(parsed.mbtiType))mbtiType=parsed.mbtiType;
    if(Array.isArray(parsed.partnerAnswers)) partnerAnswers=PARTNER_QUESTIONS.map((_,i)=>typeof parsed.partnerAnswers[i]==='string'?parsed.partnerAnswers[i].slice(0,2000):'');
    if(Array.isArray(parsed.answers)) answers=TOPICS.map((_,i)=>{
      const x=parsed.answers[i]||{};
      return {choice:Number.isInteger(x.choice)&&x.choice>=0&&x.choice<4?x.choice:null,judgment:Number.isInteger(x.judgment)&&x.judgment>=0&&x.judgment<3?x.judgment:null,a:typeof x.a==='string'?x.a.slice(0,2000):'',b:typeof x.b==='string'?x.b.slice(0,2000):'',c:typeof x.c==='string'?x.c.slice(0,2000):''};
    });
  }
}catch(err){saveAvailable=false;saveIndicator.textContent='浏览器无法保存，离开页面后回答可能丢失';}

const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function formatAiResult(value){
  const inline=text=>esc(text).replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>');
  const blocks=[];let paragraph=[],items=[],listType='';
  const flushParagraph=()=>{if(paragraph.length){blocks.push('<p>'+paragraph.map(inline).join('<br>')+'</p>');paragraph=[];}};
  const flushList=()=>{if(items.length){blocks.push('<'+listType+'>'+items.map(x=>'<li>'+inline(x)+'</li>').join('')+'</'+listType+'>');items=[];listType='';}};
  for(const raw of String(value).split(/\r?\n/)){
    const line=raw.trim();
    if(!line){flushParagraph();flushList();continue;}
    const heading=line.match(/^(#{1,6})[ \t]+(.+)$/);
    if(heading){flushParagraph();flushList();const tag=heading[1].length<=2?'h3':'h4';blocks.push('<'+tag+'>'+inline(heading[2])+'</'+tag+'>');continue;}
    const list=line.match(/^(?:([-*•])\s+|\d+[.)、]\s*)(.+)$/);
    if(list){flushParagraph();const type=list[1]?'ul':'ol';if(listType&&listType!==type)flushList();listType=type;items.push(list[2]);continue;}
    flushList();paragraph.push(line);
  }
  flushParagraph();flushList();return blocks.join('');
}
const filled=a=>a.choice!==null||a.judgment!==null||a.a.trim()!==''||a.b.trim()!==''||a.c.trim()!=='';
const countFilled=()=>answers.filter(filled).length;
function persist(){
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify({answers,partnerAnswers,aiAnalysis,analysisFormat,mbtiType,aiModel,aiReasoningEffort,aiRevision}));saveAvailable=true;saveIndicator.textContent='已自动保存在当前浏览器';}
  catch(err){saveAvailable=false;saveIndicator.textContent='浏览器无法保存，离开页面后回答可能丢失';}
  renderNav();
}
function markAnswerChanged(){answerRevision++;aiAnalysis='';aiModel='';aiReasoningEffort='';aiRevision=0;analysisFormat=2;aiConsent=false;includeAi=false;aiStatus='';}
function toast(text){
  const el=document.querySelector('#toast');el.textContent=text;el.classList.add('visible');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),3200);
}
function renderNav(){
  const n=countFilled();document.querySelector('#progress-count').textContent=`已写 ${n} / 6`;
  document.querySelector('#progress-fill').style.width=`${n/TOPICS.length*100}%`;
  nav.innerHTML=TOPICS.map((t,i)=>`<button type="button" class="step-button ${!showingResults&&i===current?'active':''}" data-step="${i}" ${!showingResults&&i===current?'aria-current="step"':''}><span class="step-index">${String(i+1).padStart(2,'0')}</span><span class="step-name">${esc(t.name)}</span><span class="step-indicator ${filled(answers[i])?'done':''}" aria-hidden="true"></span></button>`).join('')+`<button type="button" class="step-button ${!showingResults&&current===TOPICS.length?'active':''}" data-step="${TOPICS.length}" ${!showingResults&&current===TOPICS.length?'aria-current="step"':''}><span class="step-index">＋</span><span class="step-name">了解对方</span><span class="step-indicator ${partnerAnswers.some(x=>x.trim())?'done':''}" aria-hidden="true"></span></button>`;
}
function renderStep(){
  if(current===TOPICS.length){renderPartner();return;}
  showingResults=false;const t=TOPICS[current],a=answers[current];
  panel.innerHTML=`<div class="question-meta"><span>${esc(t.name)}</span><span>第 ${current+1} 个主题 / 共 6 个主题</span></div>
    <h2>${esc(t.title)}</h2><p class="topic-intro">${esc(t.perspective)}</p><div class="topic-divider"></div>
    <fieldset class="field-block" style="border:0;padding:0;margin-left:0;margin-right:0"><legend class="field-label">选一项：${esc(t.question)}</legend><p class="field-help">选择最接近你的一项，也可以跳过。</p><div class="choices">${t.options.map((o,i)=>`<label class="choice"><input type="radio" name="situation" value="${i}" ${a.choice===i?'checked':''}><span>${esc(o.label)}</span></label>`).join('')}</div></fieldset>
    <fieldset class="field-block" style="border:0;padding:0;margin-left:0;margin-right:0"><legend class="field-label">判断一下：${esc(t.judgment.statement)}</legend><p class="field-help">这句话现在符合你的情况吗？没有正确或错误的答案。</p><div class="choices judgment-choices">${JUDGMENT_LABELS.map((label,i)=>`<label class="choice"><input type="radio" name="judgment" value="${i}" ${a.judgment===i?'checked':''}><span>${esc(label)}</span></label>`).join('')}</div></fieldset>
    ${t.prompts.map((p,i)=>{const k=['a','b','c'][i];return `<div class="field-block"><label class="field-label" for="answer-${k}">${esc(p)}</label><p class="field-help">不想写也没关系，想写多少都可以。</p><textarea class="answer" id="answer-${k}" data-answer="${k}" maxlength="2000" placeholder="${esc(t.placeholders[i])}">${esc(a[k])}</textarea><div class="field-counter"><span id="count-${k}">${a[k].length}</span> / 2000</div></div>`}).join('')}
    <div class="panel-actions"><button type="button" class="ghost-button" data-action="prev" ${current===0?'disabled':''}>← 上一个主题</button><button type="button" class="button button-primary" data-action="next">${current===TOPICS.length-1?'继续了解对方':'下一个主题'} <span aria-hidden="true">→</span></button></div>`;
  renderNav();
}
function renderPartner(){
  showingResults=false;
  panel.innerHTML=`<div class="question-meta"><span>视频结尾的延伸练习</span><span>可以全部跳过</span></div><h2>你了解此刻的对方吗？</h2><p class="topic-intro">先按自己的了解写下想法，有机会再问问对方是否如此；没有合适的对象，可以直接跳过。</p><div class="topic-divider"></div>${PARTNER_QUESTIONS.map((q,i)=>`<div class="field-block"><label class="field-label" for="partner-${i}">${i+1}．${esc(q)}</label><p class="field-help">可以写你的想法，以及哪些部分还需要问问对方。</p><textarea class="answer" id="partner-${i}" data-partner="${i}" maxlength="2000" placeholder="不确定也可以如实写下。">${esc(partnerAnswers[i])}</textarea><div class="field-counter"><span id="partner-count-${i}">${partnerAnswers[i].length}</span> / 2000</div></div>`).join('')}<div class="panel-actions"><button type="button" class="ghost-button" data-action="prev">← 上一个主题</button><button type="button" class="button button-primary" data-action="next">整理我的回答 <span aria-hidden="true">→</span></button></div>`;
  renderNav();
}
const SUMMARY_FOCUS=[
  ['亲近的同时保留自己的生活','不让对方失望','自己能做决定',null],
  ['独处和安心都能得到照顾','在分开时仍被在意','有属于自己的空间',null],
  ['自己的需要能得到回应','自己的用心被看见','双方都认真付出',null],
  ['两个人能把话说清楚','不必解释也能被理解','问题能尽快解决','能够安全地表达'],
  ['相处中继续了解彼此','找回亲近的机会','继续被喜欢',null],
  ['有依据地做自己的决定','做出让自己放心的选择','自己有选择权',null]
];
function overallSummary(){
  const focus=TOPICS.map((_,i)=>answers[i].choice===null?null:SUMMARY_FOCUS[i][answers[i].choice]).filter(Boolean);
  const lines=[];
  if(focus.length)lines.push('从已选的部分看，你比较在意'+focus.slice(0,3).join('、')+'。这些需要都可以拿出来商量，值得留意的是，你现在的做法能否让对方听懂。');
  else if(answers.some(a=>a.judgment!==null))lines.push('你已经判断了自己在关系中的一些状态。与其要求自己每次都处理得好，不如先找一件最想改变的小事，看看当时是什么让表达或行动变得困难。');
  else lines.push('你已经写下了一些想法。要进一步理解这些经历背后的需要和顾虑，可以在下方生成智能分析；简要整理只参考选择和判断。');
  if(answers[3].choice===3)lines.push('最需要先照顾的是表达时的安全感。遇到威胁或羞辱时，可以先找信任的人帮忙，再考虑是否继续谈。');
  else if(answers[0].choice===1&&answers[2].choice===1)lines.push('你可能习惯先让对方满意，再处理自己的感受。这样短期能少一点冲突，但如果需要一直没说出口，委屈也可能慢慢累积。可以先练习提出一个小请求。');
  else if(answers[1].choice===1&&answers[3].choice===1)lines.push('你可能很希望被在意，却又等着对方主动发现。需要越难说清，等待时就越容易不安；先约定一个联系时间，可能比反复猜测更有帮助。');
  else if(answers[4].choice===2&&answers[0].choice===1)lines.push('为了留住喜欢而一再配合，可能让你越来越难确认自己真正愿意什么。可以从保留一件自己喜欢的小事开始，看看双方能否接受不同。');
  else if(answers.some(a=>(a.choice===0&&a.judgment===1)||(a.choice===1&&a.judgment===0)))lines.push('有些回答呈现了“希望怎样相处”和“实际能否做到”的差别。它可能与具体对象、当时的情绪有关，可以找一次真实经历来核对。');
  else if(focus.length)lines.push('可以先挑一个最常发生的小场景，试着说清自己的感受和一个具体请求，再观察双方是否都觉得更舒服。');
  return lines;
}
function topicAnalysis(i){
  const a=answers[i],t=TOPICS[i],o=a.choice===null?null:t.options[a.choice];
  const lines=[];
  if(o)lines.push(o.insight);
  if(a.judgment!==null){
    if(o&&((a.choice===0&&a.judgment===1)||(a.choice===1&&a.judgment===0)))lines.push('你对自己状态的判断和通常的做法有些差别。可以看看，哪些时候比较做得到，哪些时候又很难。');
    else if(!o||a.judgment!==0)lines.push(t.judgment.notes[a.judgment]);
  }
  if(!lines.length)lines.push('这一部分你写了自己的经历。生成智能分析后，会进一步理解这些做法可能和什么需要、顾虑有关。');
  return {lines,action:o?o.action:''};
}
function buildShare(include, includeAnalysis=false){
  const hasAnswers=countFilled()>0||partnerAnswers.some(x=>x.trim());
  const lines=['我的亲密关系笔记',''];
  if(!hasAnswers)return lines.concat('还没有填写回答。').join('\n');
  if(includeAnalysis&&aiAnalysis){lines.push('【智能分析】',aiAnalysis,'');}
  else{
    lines.push('【整体总结】',...overallSummary(),'','【逐项分析】');
    TOPICS.forEach((t,i)=>{if(!filled(answers[i]))return;const item=topicAnalysis(i);lines.push(t.name,...item.lines);if(item.action)lines.push('可以试试：'+item.action);lines.push('');});
    if(partnerAnswers.some(x=>x.trim()))lines.push('了解对方：可以找机会和对方确认自己的观察。','');
  }
  if(include){
    lines.push('【我写下的补充】');
    TOPICS.forEach((t,i)=>{const a=answers[i];const notes=[a.a,a.b,a.c].filter(v=>v.trim());if(notes.length)lines.push(t.name,...notes.map(v=>v.trim()),'');});
    const notes=partnerAnswers.filter(v=>v.trim());if(notes.length)lines.push('对对方的观察',...notes.map(v=>v.trim()),'');
  }
  lines.push('这份整理仅供思考，不能代替你自己的判断。');return lines.join('\n');
}
function buildPrompt(){
  const lines=['请结合大麦哥视频的六个主题和可靠的关系研究，全面理解我的回答背后可能在意什么、担心什么，以及怎样影响相处。先写整体总结，帮助我看清自己的感情；再说明我已有的优点和需要改进的具体习惯；完整分析已答主题及其他有依据的重要线索；最后给我能自己开始做的相处行动和第一人称陈述话术。不要用问句，不要把建议变成让我向另一半提问，不要只复述题目或答案。明确区分事实与可能性，用日常中文，不给人格分型或关系打分。',''];
  if(mbtiType)lines.push('我自愿提供的MBTI类型：'+mbtiType+'。仅作为我的自我描述，请用实际经历核对，不推断对方类型或匹配度。','');
  TOPICS.forEach((t,i)=>{const a=answers[i];if(!filled(a))return;lines.push('【'+t.name+'】');if(a.choice!==null)lines.push('通常的做法（'+t.question+'）：'+t.options[a.choice].label);if(a.judgment!==null)lines.push('自我判断：'+t.judgment.statement+'——'+JUDGMENT_LABELS[a.judgment]);t.prompts.forEach((p,j)=>{const value=[a.a,a.b,a.c][j].trim();if(value)lines.push(p+'\n'+value);});lines.push('');});
  if(partnerAnswers.some(x=>x.trim())){lines.push('【了解对方：以下是我的观察或猜想，并非对方已确认的事实】');PARTNER_QUESTIONS.forEach((q,i)=>{if(partnerAnswers[i].trim())lines.push(q+'\n'+partnerAnswers[i].trim());});}
  return lines.join('\n');
}
function renderLocalAnalysis(){
  const hasAnswers=countFilled()>0||partnerAnswers.some(x=>x.trim());
  if(!hasAnswers)return '<section class="summary-callout"><h3>还没有填写回答</h3><p>先选一个主题，选一项或写一点想法，再来看看分析。</p></section>';
  return `<section class="summary-callout" aria-labelledby="overall-title"><h3 id="overall-title">整体总结</h3>${overallSummary().map(x=>`<p>${esc(x)}</p>`).join('')}</section>
  <div class="analysis-section-heading"><h3>逐项分析</h3><p>这里只显示你回答过的部分。</p></div>
  ${TOPICS.map((t,i)=>{if(!filled(answers[i]))return '';const item=topicAnalysis(i);return `<section class="result-section"><h4>${esc(t.name)} · ${esc(t.title)}</h4>${item.lines.map(x=>`<p>${esc(x)}</p>`).join('')}${item.action?`<p class="result-next"><strong>可以试试</strong>${esc(item.action)}</p>`:''}</section>`;}).join('')}
  ${partnerAnswers.some(x=>x.trim())?'<section class="result-section"><h4>了解对方</h4><p>你已经在留意对方的生活。把观察变成一次关心，可以先说出你留意到的变化和愿意提供的帮助，例如：“我留意到你最近有些累，我想多分担一点。”再给对方表达实际感受的空间。</p></section>':''}`;
}
function renderResults(){
  showingResults=true;renderNav();const n=countFilled();const hasAnswers=n>0||partnerAnswers.some(x=>x.trim());const currentAi=aiAnalysis&&analysisFormat===2;const needsUpgrade=!!aiAnalysis&&aiRevision<CURRENT_ANALYSIS_REVISION;
  panel.innerHTML=`<div class="question-meta"><span>你的亲密关系笔记</span><span>已回答 ${n} / 6 个主题</span></div><h2 class="results-title">看见做法背后的自己。</h2><p class="results-lead">先看整体，再看每个主题。${currentAi?'这份分析结合了你的回答、视频观点和关系研究，可能的解释需要用真实相处来核对。':'以下是根据选择和判断做的简要整理；想进一步理解文字回答，可以在下方生成智能分析。'}</p>
  ${currentAi&&aiModel?`<p class="field-help">本次分析使用：${esc(aiModel)}${aiReasoningEffort==='high'?' · 高推理':''}</p>`:''}
  ${needsUpgrade?`<section class="summary-callout" id="analysis-upgrade"><h3>用已有回答更新这份分析</h3><p>保留六个主题的完整分析，进一步看清自己的感情、已有的优点和需要调整的习惯，并给出具体的相处行动。</p><p>在下方填写自己的密钥后，可以用已有回答重新生成。费用计入你的 OpenAI 账户；更新成功前保留原结果。</p><button type="button" class="button button-primary" data-action="upgrade-analysis" ${aiBusy||!hasAnswers||!sessionApiKey.trim()||!aiConsent||location.protocol==='file:'?'disabled':''}>${aiBusy?'正在更新，请稍候':'用已有回答更新分析'}</button></section>`:''}
  <div id="analysis-output" class="analysis-output">${currentAi?`<div class="ai-result-text">${formatAiResult(aiAnalysis)}</div>`:renderLocalAnalysis()}</div>
  ${aiAnalysis&&!currentAi?`<details class="previous-analysis"><summary>查看之前保存的分析</summary><p>上次的结果仍保留在这里。重新分析后，会按“整体总结、逐项分析”的方式显示。</p><div class="ai-result-text">${formatAiResult(aiAnalysis)}</div></details>`:''}
  <section class="action-panel ai-panel" aria-labelledby="ai-title"><h3 id="ai-title">${currentAi?'继续完善这份分析':'进一步理解你的回答'}</h3><p>结合大麦哥的视频，看看你的做法可能与哪些需要和顾虑有关，再给出能实际尝试的建议。</p><div class="api-config"><h4>使用你自己的 OpenAI 密钥</h4><p>智能分析的费用由你的 OpenAI API 账户承担；ChatGPT 订阅不等于 API 额度。</p><label for="openai-api-key">API 密钥</label><div class="key-input-row"><input id="openai-api-key" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="512" placeholder="粘贴你自己的密钥" aria-describedby="api-key-help" ${aiBusy?'disabled':''}><button type="button" class="button button-secondary" data-action="clear-api-key" ${aiBusy?'disabled':''}>清除密钥</button></div><p id="api-key-help">密钥只在当前页面临时保留，刷新、离开或清除后需要重新填写；不会写入回答记录或分享内容。</p><details><summary>模型设置</summary><label for="openai-model">模型标识</label><input id="openai-model" type="text" value="${esc(selectedModel)}" autocomplete="off" spellcheck="false" maxlength="100" ${aiBusy?'disabled':''}><p>默认使用 GPT-6.1 Sol 高推理。可填写自己账户可用、支持 Responses 接口与高推理的模型标识；没有权限时会提示，不会自动换模型。</p></details><p class="api-trust-note">提交后，当前网站的服务端会接收你的密钥与回答，并向 OpenAI 发起请求。本项目的服务端不保存这些内容；请只在你信任的网站或自己部署的版本里使用密钥。</p><a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">在 OpenAI 管理自己的密钥 ↗</a></div><div class="mbti-field"><label for="mbti-type">你的 MBTI 类型（选填）</label><select id="mbti-type" aria-describedby="mbti-help" ${aiBusy?'disabled':''}><option value="">不清楚 / 暂不填写</option>${MBTI_TYPES.map(type=>`<option value="${type}" ${mbtiType===type?'selected':''}>${type}</option>`).join('')}</select><p id="mbti-help">只作你对自己的描述，不根据这些题目测人格，也不计算两个人是否“匹配”。</p></div><p>分析时，已填回答${mbtiType?'和你填写的类型':''}会发送给 OpenAI；网站不在服务器保存回答，结果保存在当前浏览器。</p><label class="share-options"><input type="checkbox" id="ai-consent" ${aiConsent?'checked':''} ${!hasAnswers||aiBusy?'disabled':''}>我同意通过本站向 OpenAI 发送本次回答，并使用自己的密钥付费分析</label><button type="button" class="button button-primary" data-action="analyze" ${!hasAnswers||!aiConsent||!sessionApiKey.trim()||aiBusy||location.protocol==='file:'?'disabled':''}>${aiBusy?'正在分析，请稍候':aiAnalysis?'重新分析':'生成智能分析'}</button><p class="ai-status" id="ai-status" role="status" aria-live="polite">${esc(location.protocol==='file:'?'请通过本地启动服务或部署后的网址使用智能分析。':aiStatus)}</p><p class="usage-note">不使用站长的共享额度。每次点击只发起一次请求；使用量和账单请在自己的 OpenAI 账户查看。</p></section>
  <details class="analysis-references"><summary>分析参考了什么？</summary><p>主要围绕大麦哥视频中的独立、空间、付出、沟通、吸引和外界意见。研究帮助提供思考角度，具体解释仍以你的经历为准。</p><ul><li><a href="https://v.douyin.com/cGLAwCn2u2s/" target="_blank" rel="noopener noreferrer">大麦哥：关于爱情，我终于想明白了几件事</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/17352602/" target="_blank" rel="noopener noreferrer">自主、亲近与关系中的需要</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5922804/" target="_blank" rel="noopener noreferrer">被理解、被重视和被关心的关系研究</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/32719123/" target="_blank" rel="noopener noreferrer">长期伴侣研究：关系体验与预测的局限</a></li><li><a href="https://labs.psychology.illinois.edu/~rcfraley/measures/ecrr.htm" target="_blank" rel="noopener noreferrer">成人依恋：不安与回避的维度</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/19803610/" target="_blank" rel="noopener noreferrer">冲突中催促与退开的互动研究</a></li><li><a href="https://github.com/rubynor/bigfive-web" target="_blank" rel="noopener noreferrer">开放人格测评实现：仅作方法参考</a></li></ul><p>这里没有照搬人格量表，也不把这份练习当作人格测验。</p></details>
  <section class="action-panel"><h3>分享之前，先看看内容</h3><p>默认分享简要分析。你写的文字和智能分析，只有勾选后才会附上。</p><label class="share-options"><input type="checkbox" id="include-notes" ${includeNotes?'checked':''}>附上我写的文字</label><label class="share-options"><input type="checkbox" id="include-ai" ${includeAi?'checked':''} ${aiAnalysis?'':'disabled'}>附上智能分析</label><pre class="share-preview" id="share-preview">${esc(buildShare(includeNotes,includeAi))}</pre><button type="button" class="button button-secondary" data-action="copy-result" ${hasAnswers?'':'disabled'}>复制预览内容</button><button type="button" class="button button-secondary" data-action="share-app">复制练习网址</button></section>
  <details class="other-analysis"><summary>用自己的智能对话工具继续聊</summary><p>可以复制已填回答和分析要求，再粘贴到你信任的工具中。复制内容包含你的文字和选填类型，请确认愿意分享。</p><button type="button" class="button button-secondary" data-action="copy-prompt" ${hasAnswers?'':'disabled'}>复制回答和分析要求</button><a class="button button-secondary" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">打开智能对话</a></details>
  <div class="panel-actions"><button type="button" class="ghost-button" data-action="edit">← 返回修改</button><button type="button" class="button button-secondary" data-action="share-app">分享这份练习 ↗</button></div>`;
  // 用属性赋值，避免密钥进入 HTML 字符串和属性快照。
  const keyInput=panel.querySelector('#openai-api-key');
  if(keyInput)keyInput.value=sessionApiKey;
}
async function runAnalysis(){
  if(aiBusy||!aiConsent||(!countFilled()&&!partnerAnswers.some(x=>x.trim())))return;
  const apiKey=sessionApiKey.trim();
  if(!/^sk-[A-Za-z0-9_-]{12,500}$/.test(apiKey)){aiStatus='请填写有效的 OpenAI API 密钥；密钥不会保存到浏览器记录。';renderResults();return;}
  const model=selectedModel.trim();
  if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/.test(model)){aiStatus='模型标识格式不正确，请检查模型设置。';renderResults();return;}
  const payload=buildPrompt();
  if(payload.length>25000){aiStatus='回答较长，请适当精简后再发起智能分析。';renderResults();return;}
  const started=answerRevision;
  const controller=new AbortController();
  analysisAbort=controller;
  const analysisTimeout=setTimeout(()=>controller.abort(),130000);
  aiBusy=true;aiStatus='正在深入分析，可能需要一两分钟，请保持页面打开。';renderResults();
  try{
    const response=await fetch('/api/analyze',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({answers:payload,apiKey,model}),signal:controller.signal,cache:'no-store',credentials:'same-origin'});
    let data;try{data=await response.json();}catch{throw new AnalysisError('分析服务返回异常，请稍后再试。');}
    if(!response.ok)throw new AnalysisError(typeof data?.error==='string'&&/[\u4e00-\u9fff]/.test(data.error)?data.error.slice(0,300):'分析暂未完成，请稍后再试。');
    if(typeof data?.analysis!=='string'||!data.analysis.trim())throw new AnalysisError('这次没有生成分析，请稍后再试。');
    if(started!==answerRevision){aiStatus='回答已修改，本次分析未保存；请确认后重新分析。';}
    else{analysisFormat=2;aiRevision=Number.isInteger(data.analysisRevision)?data.analysisRevision:0;aiModel=typeof data.model==='string'?data.model.slice(0,120):'';aiReasoningEffort=typeof data.reasoningEffort==='string'?data.reasoningEffort.slice(0,20):'';const incomplete=data.incomplete||data.analysis.length>16000;aiAnalysis=data.analysis.slice(0,16000)+(incomplete?'\n\n（本次分析不完整，可尝试精简回答后重试。）':'');aiStatus=incomplete?'已保存本次生成的部分分析；需要完整结果时可重试。':'分析完成，结果已保存在当前浏览器。';persist();}
  }catch(error){aiStatus=error?.name==='AbortError'?'分析等待超时或已取消，原有结果仍保留。':error instanceof AnalysisError?error.message.replaceAll(apiKey,'[密钥已隐藏]'):'无法连接分析服务，请检查网络后重试；原有结果仍保留。';}
  finally{clearTimeout(analysisTimeout);analysisAbort=null;aiBusy=false;if(showingResults){renderResults();if(started===answerRevision&&aiAnalysis&&analysisFormat===2)scrollPanel();}else toast(aiStatus);}
}
function scrollPanel(){if(matchMedia('(max-width: 680px)').matches)document.querySelector('#exercise').scrollIntoView({behavior:'smooth',block:'start'});else panel.scrollIntoView({behavior:'smooth',block:'start'});}
async function copyText(value,success){
  try{
    if(navigator.clipboard&&window.isSecureContext) await navigator.clipboard.writeText(value);
    else {const t=document.createElement('textarea');t.value=value;t.setAttribute('readonly','');t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();const ok=document.execCommand('copy');t.remove();if(!ok)throw new Error('copy');}
    toast(success);
  }catch(err){toast('复制未成功，请长按或手动选择文字复制');}
}
function shareApp(){
  if(location.protocol==='file:'){toast('当前是本地文件，请使用发布后的网址分享');return;}
  const url=location.origin+location.pathname;copyText(url,'练习网址已复制，不包含你的回答');
}
nav.addEventListener('click',event=>{const b=event.target.closest('[data-step]');if(!b)return;current=Number(b.dataset.step);renderStep();scrollPanel();});
panel.addEventListener('input',event=>{
  const target=event.target;
  if(target.id==='openai-api-key'){sessionApiKey=target.value;updateAnalysisButtons();return;}
  if(target.id==='openai-model'){selectedModel=target.value;return;}
  if(target.matches('textarea[data-partner]')){const i=Number(target.dataset.partner);markAnswerChanged();partnerAnswers[i]=target.value;document.querySelector('#partner-count-'+i).textContent=target.value.length;persist();}
  if(target.matches('textarea[data-answer]')){const key=target.dataset.answer;markAnswerChanged();answers[current][key]=target.value;document.querySelector('#count-'+key).textContent=target.value.length;persist();}
});
panel.addEventListener('change',event=>{
  const target=event.target;
  if(target.matches('input[name="situation"]')){markAnswerChanged();answers[current].choice=Number(target.value);persist();}
  if(target.matches('input[name="judgment"]')){markAnswerChanged();answers[current].judgment=Number(target.value);persist();}
  if(target.id==='mbti-type'){markAnswerChanged();mbtiType=MBTI_TYPES.includes(target.value)?target.value:'';persist();renderResults();}
  if(target.id==='ai-consent'){aiConsent=target.checked;updateAnalysisButtons();}
  if(target.id==='include-notes'){includeNotes=target.checked;document.querySelector('#share-preview').textContent=buildShare(includeNotes,includeAi);}
  if(target.id==='include-ai'){includeAi=target.checked;document.querySelector('#share-preview').textContent=buildShare(includeNotes,includeAi);}
});
panel.addEventListener('click',event=>{
  const b=event.target.closest('[data-action]');if(!b)return;
  const action=b.dataset.action;
  if(action==='prev'&&current>0){current--;renderStep();scrollPanel();}
  if(action==='next'){if(current<TOPICS.length){current++;renderStep();}else renderResults();scrollPanel();}
  if(action==='edit'){renderStep();scrollPanel();}
  if(action==='share-app')shareApp();
  if(action==='analyze')runAnalysis();
  if(action==='upgrade-analysis'&&!aiBusy)runAnalysis();
  if(action==='clear-api-key'&&!aiBusy){sessionApiKey='';const field=panel.querySelector('#openai-api-key');if(field){field.value='';field.focus();}updateAnalysisButtons();toast('本页临时密钥已清除');}
  if(action==='copy-result')copyText(buildShare(includeNotes,includeAi),'已复制预览内容，请确认分享对象');
  if(action==='copy-prompt')copyText(buildPrompt(),'已复制完整回答和提问');
});
document.querySelector('#open-results').addEventListener('click',()=>{renderResults();scrollPanel();});
document.querySelector('#share-app').addEventListener('click',shareApp);
document.querySelector('#clear-data').addEventListener('click',()=>{
  if(!confirm('确定清除当前浏览器里保存的全部回答吗？此操作无法撤销。'))return;
  sessionApiKey='';aiConsent=false;analysisAbort?.abort();
  markAnswerChanged();answers=emptyAnswers();partnerAnswers=PARTNER_QUESTIONS.map(()=>'');current=0;includeNotes=false;mbtiType='';
  try{localStorage.removeItem(STORAGE_KEY);}catch(err){saveAvailable=false;}
  renderStep();saveIndicator.textContent=saveAvailable?'已清除本机回答':'浏览器无法保存，离开页面后回答可能丢失';toast('本机回答已清除');
});
if(location.hash==='#analysis'){renderResults();requestAnimationFrame(scrollPanel);}else renderStep();
window.addEventListener('hashchange',()=>{if(location.hash==='#analysis'){renderResults();scrollPanel();}});

function updateAnalysisButtons(){
  const unavailable=aiBusy||!aiConsent||!sessionApiKey.trim()||(!countFilled()&&!partnerAnswers.some(x=>x.trim()))||location.protocol==='file:';
  for(const button of panel.querySelectorAll('[data-action="analyze"], [data-action="upgrade-analysis"]'))button.disabled=unavailable;
}
window.addEventListener('pagehide',()=>{
  sessionApiKey='';aiConsent=false;analysisAbort?.abort();
  const input=panel.querySelector('#openai-api-key');if(input)input.value='';
  const consent=panel.querySelector('#ai-consent');if(consent)consent.checked=false;
  updateAnalysisButtons();
});
