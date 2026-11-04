/* The four lines used in almost every interview. */
const INTERVIEW_ESSENTIALS = [
  { text: 'My name is [name]. I have [years] years of experience and I am looking for a long-term role.', when: 'About you' },
  { text: 'Can you repeat the question? I want to answer the right one.', when: 'Did not understand' },
  { text: 'That is a good question. Let me think for one second.', when: 'Need time' },
  { text: 'What are the next steps, and when might I hear from you?', when: 'End of interview' }
];

/* The facts that fill the blanks. Collected once, used everywhere. */
const PROFILE_FIELDS = [
  { key: 'name', label: 'Your name', hint: 'Maria Santos', wide: true },
  { key: 'years', label: 'Years of experience', hint: 'two', wide: false },
  { key: 'location', label: 'Where you are based', hint: 'Cebu, Philippines', wide: true },
  { key: 'timezone', label: 'Your time zone', hint: 'Philippine time (GMT+8)', wide: true },
  { key: 'hours', label: 'Hours you can work daily', hint: 'eight', wide: false },
  { key: 'rate', label: 'Your hourly rate', hint: 'four dollars an hour', wide: true },
  { key: 'tools', label: 'Tools you use', hint: 'Google Workspace, Excel, Slack, Zoom', wide: true },
  { key: 'strength', label: 'What you are best at', hint: 'customer support and scheduling', wide: true },
  { key: 'company', label: 'Company you are interviewing with', hint: 'their company name', wide: true },
  { key: 'businessName', label: 'Business whose calls you answer', hint: 'the client you support', wide: true }
];

/* The interviewer is the one speaking here, so cues are THEIR questions.
   Blanks [name] [years] [location] [timezone] [hours] [rate] [tools] [strength]
   are filled from "My details"; the rest are filled by hand before you speak. */

const INTERVIEW_PHRASEBOOK = [
  {
    id: 'intro_self',
    group: 'interview',
    when: 'They ask you to introduce yourself.',
    cues: ['tell me about yourself', 'introduce yourself', 'about you', 'what do you do', 'tell me something about'],
    replies: [
      { text: 'My name is [name]. I have worked as a [strength] for [years] years, and I am now looking for a virtual assistant role.', when: 'Short, factual, no story.' },
      { text: 'I am [name]. I handle admin and customer support, and I am reliable with daily tasks like email, scheduling, and follow-ups.', when: 'Use when the job is admin-heavy.' },
      { text: 'I am [name]. English is not my first language, but I answer calls and write clearly every day, and I always confirm what I heard.', when: 'Honest about English — shows you have a system.' }
    ]
  },
  {
    id: 'why_this_job',
    group: 'interview',
    when: 'They ask why you want this job or why a virtual assistant role.',
    cues: ['why do you want', 'why this position', 'why virtual assistant', 'why should we hire', 'what interests you'],
    replies: [
      { text: 'I want a role where I can be trusted with the same tasks every day and make your workload lighter.', when: 'Simple and honest.' },
      { text: 'I enjoy organising things and answering customers. This job uses both of those every day.', when: 'Connects to the actual work.' },
      { text: 'I am organised, I learn your process quickly, and I stay calm on difficult calls. That is what this role needs.', when: 'Answering "why you".' }
    ]
  },
  {
    id: 'experience',
    group: 'interview',
    when: 'They ask about your past work or experience.',
    cues: ['your experience', 'do you have experience', 'previous work', 'have you worked', 'what have you done', 'your background', 'what did you do'],
    replies: [
      { text: 'I have [years] years of experience. I handled [tools] and customer enquiries, and I kept records up to date.', when: 'Years plus what you actually did.' },
      { text: 'My experience is in [strength]. I have not used your exact system yet, but I learn new tools in a few days.', when: 'Honest when you lack their tool.' },
      { text: 'Can I tell you about the closest work I have done to this role?', when: 'When your background is different but transferable.' }
    ]
  },
  {
    id: 'english_level',
    group: 'interview',
    when: 'They test your English or ask about phone calls.',
    cues: ['how is your english', 'your english level', 'comfortable speaking english', 'handle english calls', 'fluent', 'language skills', 'on a call with a client'],
    replies: [
      { text: 'I can write well and speak clearly on familiar topics. On fast calls I confirm the important details back to the person.', when: 'Do not claim fluent if you are not.' },
      { text: 'I am comfortable with written English and everyday phone conversations. I am still improving my listening speed, so I take notes.', when: 'Honest plus shows a habit.' },
      { text: 'Yes. If I do not understand something, I ask them to repeat it instead of guessing. I do not want to give a wrong answer to a client.', when: 'This is the answer they want.' }
    ]
  },
  {
    id: 'strengths',
    group: 'interview',
    when: 'They ask what you are good at.',
    cues: ['your strengths', 'what are you good at', 'what are your skills', 'what are you best at', 'strongest skill'],
    replies: [
      { text: 'I am good at [strength]. I do it carefully and I do not need to be told twice.', when: 'One strength, then stop.' },
      { text: 'I am dependable. I show up on time, I finish what I started, and I tell you early if something is wrong.', when: 'Reliability beats talent for a VA.' },
      { text: 'I am patient with customers, even when they are upset. I listen, I repeat their problem back, then I fix what I can.', when: 'For support or calls.' }
    ]
  },
  {
    id: 'weakness',
    group: 'interview',
    when: 'They ask about a weakness or something you are working on.',
    cues: ['your weakness', 'what is your weakness', 'something you struggle', 'area of improvement', 'working on yourself', 'what can you improve'],
    replies: [
      { text: 'Speaking English fast is still hard for me. I practise every day and I use short sentences, which clients understand better anyway.', when: 'Real weakness, with your fix.' },
      { text: 'I used to say yes to every task. Now I check my list first and tell you what I can finish today.', when: 'Shows you set limits.' },
      { text: 'I am careful, so I take a little longer at the start. Once I know the process, I am fast.', when: 'Safe honest answer.' }
    ]
  },
  {
    id: 'tools',
    group: 'interview',
    when: 'They ask about tools, software, or equipment you use.',
    cues: ['what tools', 'are you familiar', 'do you know how to use', 'what software', 'which platforms', 'have you used', 'what do you use for', 'quiet workspace', 'internet connection', 'backup power', 'headset', 'your setup', 'do you have a laptop'],
    replies: [
      { text: 'I use [tools]. I am quick to learn a new system if you show me once and give me the steps in writing.', when: 'Yes + how you learn.' },
      { text: 'I have not used that one yet. Can you tell me what you use it for? I will learn it before I start.', when: 'Never pretend on a tool test.' },
      { text: 'I have a laptop, a headset, a quiet room, and [hours] hours of backup internet and power.', when: 'Equipment question = proof you can work.' }
    ]
  },
  {
    id: 'availability',
    group: 'interview',
    when: 'They ask about your hours, full-time or part-time, and your timezone.',
    cues: ['are you available', 'full time', 'part time', 'how many hours', 'your schedule', 'time zone', 'timezone', 'can you work our hours', 'are you free', 'work with our team hours'],
    replies: [
      { text: 'I can work [hours] hours a day. I am on [timezone], so I can cover your morning hours.', when: 'Do the maths for them.' },
      { text: 'Yes, I can work full time. I have no other job that will take my attention.', when: 'Only say yes if it is true.' },
      { text: 'I can do [hours] hours now and increase later. Which hours do you need covered?', when: 'Negotiate without sounding unsure.' }
    ]
  },
  {
    id: 'rate',
    group: 'interview',
    when: 'They ask your expected rate or salary.',
    cues: ['expected salary', 'expected rate', 'what is your rate', 'how much do you expect', 'salary expectation', 'what do you charge', 'how much per hour', 'your budget', 'rate expectation', 'pay expectation'],
    replies: [
      { text: 'I am looking for [rate] per hour. I am open to talk about it once I know the full tasks.', when: 'Give a number, keep the door open.' },
      { text: 'What is the budget for this role? I will tell you straight away if it works for me.', when: 'Turn it back politely.' },
      { text: 'I understand the range for this work is [rate]. That works for me.', when: 'When they named a range first.' }
    ]
  },
  {
    id: 'start_date',
    group: 'interview',
    when: 'They ask when you can start.',
    cues: ['when can you start', 'start immediately', 'notice period', 'how soon', 'available to start', 'start date'],
    replies: [
      { text: 'I can start right away.', when: 'Only if true.' },
      { text: 'I can start within [days] days. Is that soon enough for you?', when: 'Give a date you can keep.' },
      { text: 'I can start now, and I can also do a paid trial task this week if that helps you decide.', when: 'Strong move when they hesitate.' }
    ]
  },
  {
    id: 'difficult_customer',
    group: 'interview',
    when: 'They ask how you handle an angry customer or a difficult client.',
    cues: ['angry customer', 'difficult client', 'unhappy customer', 'how would you handle', 'complaint', 'someone is upset', 'rude customer', 'handle pressure'],
    replies: [
      { text: 'I let them finish speaking, I repeat their problem back so they know I understood, and I fix what I can. If I cannot, I tell them exactly who will.', when: 'The standard right answer.' },
      { text: 'I do not take it personally. I stay calm, I apologise for the trouble, and I give them one clear next step.', when: 'Shows emotional control.' },
      { text: 'First I check the facts, then I answer. If it is outside my authority, I write it down and pass it to you with the details.', when: 'Shows escalation discipline.' }
    ]
  },
  {
    id: 'priorities',
    group: 'interview',
    when: 'They ask how you manage many tasks or deadlines.',
    cues: ['multiple tasks', 'how do you prioritize', 'prioritise', 'deadlines', 'manage your time', 'too many things', 'organize your work', 'stay organized'],
    replies: [
      { text: 'I keep one list. I do what is urgent first, and I send you a short update at the end of the day.', when: 'Simple system, easy to trust.' },
      { text: 'If two things are due at once, I ask which one matters more. I would rather ask than guess.', when: 'This is what employers want to hear.' },
      { text: 'I write every task down as soon as it comes, so nothing depends on my memory.', when: 'Answers the worry behind the question.' }
    ]
  },
  {
    id: 'mistake',
    group: 'interview',
    when: 'They ask about a mistake you made and what you learned.',
    cues: ['tell me about a mistake', 'something went wrong', 'when you failed', 'a time you made an error', 'what did you learn', 'biggest challenge'],
    replies: [
      { text: 'I once sent the wrong information to a client. I told my employer immediately, fixed it, and after that I always checked before sending.', when: 'Own it, fix it, change the process.' },
      { text: 'I once missed a deadline because I did not say I was overloaded. Now I tell you early, not at the end.', when: 'Shows communication growth.' },
      { text: 'Can I give you an example from work that is closest to what this role needs?', when: 'Buy time to pick a good story.' }
    ]
  },
  {
    id: 'why_company',
    group: 'interview',
    when: 'They ask what you know about them or why their company.',
    cues: ['what do you know about', 'why our company', 'why us', 'why do you want to work with', 'what do you know about us'],
    replies: [
      { text: 'You work with [company] and I would like to support that kind of work every day.', when: 'Fill [company] before the interview.' },
      { text: 'I liked how you described the role in the job post. It matches what I am good at.', when: 'Safe when you did not research much.' },
      { text: 'To be honest, I am still learning about your business. Can you tell me what a good month looks like for this role?', when: 'Turn a gap into a good question.' }
    ]
  },
  {
    id: 'long_term',
    group: 'interview',
    when: 'They ask how long you will stay or your future plans.',
    cues: ['where do you see yourself', 'how long do you plan', 'long term', 'your career goals', 'stay with us', 'what are your goals'],
    replies: [
      { text: 'I want to stay and get very good at this. If I know the job well, I can take on more of it.', when: 'Stability is what they are buying.' },
      { text: 'My goal for the next year is to run this part of your work completely, so you do not have to think about it.', when: 'Ambition they can use.' },
      { text: 'I am looking for a long position, not something for a few months.', when: 'Short and clear.' }
    ]
  },
  {
    id: 'supervision',
    group: 'interview',
    when: 'They ask how you like to be managed or how you report.',
    cues: ['how do you like to be managed', 'do you work independently', 'how do you report', 'how often should we check', 'do you need supervision', 'work alone'],
    replies: [
      { text: 'I work alone well. I prefer clear instructions at the start, then a short check-in so I know I am doing it right.', when: 'Independent but coachable.' },
      { text: 'In the first weeks I would like daily check-ins, then we can move to a weekly one.', when: 'Realistic ramp-up.' },
      { text: 'I send you a list of what I finished and what is still open. Tell me if you want it daily or weekly.', when: 'Puts the choice to them.' }
    ]
  },
    {
    id: 'confidential',
    group: 'interview',
    when: 'They ask about trust: data, payments, or private information.',
    cues: ['confidential', 'sensitive information', 'payment information', 'can you be trusted', 'privacy', 'data protection', 'customer data'],
    replies: [
      { text: 'I understand that client details are private. I only use them for the task and I never share them.', when: 'Direct answer to a trust test.' },
      { text: 'Yes. I will follow whatever process you use, and I will not save customer data anywhere else.', when: 'Adds process discipline.' },
      { text: 'If I am unsure whether something is private, I will ask before I act.', when: 'Best honest answer.' }
    ]
  },
  {
    id: 'questions_to_ask',
    group: 'interview',
    when: 'They ask if you have questions. Never say no.',
    cues: ['any questions for me', 'do you have questions', 'anything you want to know', 'what would you like to ask'],
    replies: [
      { text: 'Yes. What are the first tasks you would hand over, and what does success look like after one month?', when: 'The strongest question you can ask.' },
      { text: 'How do you want to be contacted — email, chat, or calls? And how fast do you expect a reply?', when: 'Shows you think about working life.' },
      { text: 'What time zone do your clients call from most, and what hours would I cover?', when: 'Practical and shows readiness.' }
    ]
  },
  {
    id: 'reference',
    group: 'interview',
    when: 'They ask for references or proof of work.',
    cues: ['reference', 'can we contact', 'proof of work', 'portfolio', 'sample of your work', 'previous employer'],
    replies: [
      { text: 'Yes, I can give you a reference. May I ask them first before I share their number?', when: 'Polite and correct.' },
      { text: 'My last employer will confirm my attendance and my work. I will send you their details today.', when: 'If you have one.' },
      { text: 'I do not have a reference for this kind of work yet. Can I do a paid trial task instead so you can see me work?', when: 'Turns a weakness into a test they can run.' }
    ]
  },
  {
    id: 'buy_time',
    group: 'survival',
    when: 'You need a few seconds to understand the question.',
    cues: ['that is a good question', 'hmm', 'let me think', 'interesting question', 'what do you think about'],
    replies: [
      { text: 'That is a good question. Let me think for one second.', when: 'Perfectly acceptable in any interview.' },
      { text: 'Can you repeat the question? I want to answer the right one.', when: 'Better than answering the wrong thing.' },
      { text: 'Do you mean [repeat what you caught], or something else?', when: 'Confirms without admitting weakness.' }
    ]
  },
  {
    id: 'close_interview',
    group: 'interview',
    when: 'The interview is ending.',
    cues: ['thank you for your time', 'anything else you would like', 'we will get back', 'next steps', 'that is all for today', 'we will be in touch', 'goodbye'],
    replies: [
      { text: 'Thank you for your time. What are the next steps, and when might I hear from you?', when: 'Always ask this before you hang up.' },
      { text: 'Thank you. I am still very interested, and I can start within [days] days.', when: 'Reconfirm interest and start date.' },
      { text: 'Thank you for explaining the role. I will send you a short message today to confirm what we discussed.', when: 'Leaves a good impression.' }
    ]
  }
];
