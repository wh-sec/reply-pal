/* Reply Pal phrasebook — customer order & delivery calls.
   Each intent: when (why you'd say it), cues (what the caller says), replies (what you say).
   Keep replies under ~14 words. Anything in [brackets] is a slot the user fills in. */

const PHRASEBOOK = [
  {
    id: 'greeting',
    group: 'opening',
    when: 'The call just connected.',
    cues: ['hello', 'hi there', 'good morning', 'good afternoon', 'good evening', 'im calling about'],
    replies: [
      { text: 'Thank you for calling [business name]. How can I help you today?', when: 'Standard opening.' },
      { text: 'Hello, this is [your name]. How may I help you?', when: 'They asked for a person.' },
      { text: 'Hi! Are you calling about an order, or something else?', when: 'You need to know the reason fast.' }
    ]
  },
  {
    id: 'ask_repeat',
    group: 'survival',
    when: 'You did not understand, or they speak too fast.',
    cues: ['repeat that', 'say that again', 'one more time', 'did you say', 'what do you mean', 'can you hear me', 'speak up', 'pardon', { s: 'understand', w: 4 }],
    replies: [
      { text: 'Sorry, could you please repeat that?', when: 'You missed the whole sentence.' },
      { text: 'You are coming through a little unclear. Could you say that again, slowly?', when: 'The line is bad.' },
      { text: 'Just to make sure I have it right — could you repeat the [number / name / address]?', when: 'You missed one detail.' }
    ]
  },
  {
    id: 'ask_spell',
    group: 'survival',
    when: 'You need an email, code, or name written exactly.',
    cues: ['email', 'spell', 'how do you spell', 'spelling', 'last name', 'surname', 'capitalize'],
    replies: [
      { text: 'Could you spell that for me, please?', when: 'Name or street you have not heard before.' },
      { text: 'Let me read it back to you: [read it slowly]. Is that correct?', when: 'Always confirm before you save it.' },
      { text: 'Could you send it to [email or WhatsApp number] so I have it in writing?', when: 'The spelling keeps going wrong.' }
    ]
  },
  {
    id: 'take_name',
    group: 'details',
    when: 'You need to know who is calling.',
    cues: ['my name is', 'my name', 'whos calling', 'who is calling', 'for the name'],
    replies: [
      { text: 'Thank you, [name]. And what is the best number to reach you on?', when: 'Next detail to collect.' },
      { text: 'Could I take your full name, please?', when: 'They have not given it yet.' },
      { text: 'How do you like to be addressed, [name]?', when: 'Polite and soft.' }
    ]
  },
  {
    id: 'phone_number',
    group: 'details',
    when: 'A phone number is being given or asked for.',
    cues: ['phone number', 'my number', 'contact number', 'cell number', 'mobile', 'reach you'],
    replies: [
      { text: 'Could you say that number one more time? I want to get it right.', when: 'Never trust a number you heard once.' },
      { text: 'I have it as [read digits in pairs]. Is that correct?', when: 'Reading it back.' },
      { text: 'You can also reach us on [our number], Monday to Saturday.', when: 'They ask for your contact.' }
    ]
  },
  {
    id: 'address',
    group: 'details',
    when: 'They give or ask about the delivery address.',
    cues: ['address', 'deliver to', 'drop off', 'location', 'landmark', 'street', 'apartment', 'building', 'gate', 'zip code', 'postal code', 'new address', 'wrong address', 'different address', 'change the address'],
    replies: [
      { text: 'Could you give me the full address, including the landmark?', when: 'Taking the address.' },
      { text: 'Let me repeat the address back to you. Please stop me if it is wrong.', when: 'Always confirm before booking.' },
      { text: 'Is there a gate number or apartment number I should note?', when: 'Driver will get lost without it.' }
    ]
  },
  {
    id: 'order_item',
    group: 'order',
    when: 'They are saying what they want to buy.',
    cues: [{ s: 'i want', w: 4 }, 'id like', 'i would like', 'can i get', { s: 'do you have', w: 4 }, 'in stock', 'flavour', 'flavor', { s: 'order', w: 3 }, { s: 'available', w: 3 }],
    replies: [
      { text: 'Certainly. How many would you like?', when: 'Item known, quantity missing.' },
      { text: 'Just to confirm: [quantity] of [item]. Anything else?', when: 'Closing the order list.' },
      { text: 'Let me check if that is available and call you right back.', when: 'You are not sure about stock.' }
    ]
  },
  {
    id: 'menu_options',
    group: 'order',
    when: 'They ask what you have or what the choices are.',
    cues: ['what do you have', 'what options', 'menu', 'available', 'variety', 'which one', 'recommend', 'best seller', 'popular'],
    replies: [
      { text: 'We have [option A], [option B], and [option C]. Which would you like?', when: 'Reading the choices.' },
      { text: 'Most customers choose [item]. It is our best seller.', when: 'They ask for a recommendation.' },
      { text: 'Let me read our available items for you. One moment.', when: 'You need to look them up.' }
    ]
  },
  {
    id: 'quantity',
    group: 'order',
    when: 'They are changing or stating how many.',
    cues: ['how many', 'pieces', 'units', 'boxes', 'packs', 'one more', 'add another', 'reduce', 'two', 'three', 'dozen', 'kg', 'kilos'],
    replies: [
      { text: 'So that is [number] in total. Shall I confirm it for you?', when: 'Recount after a change.' },
      { text: 'There is a minimum order of [number]. Would you like to add more?', when: 'Their order is too small.' },
      { text: 'We only have [number] left. Is that enough for you?', when: 'Stock is short.' }
    ]
  },
  {
    id: 'price_total',
    group: 'order',
    when: 'They ask how much it costs or complain about price.',
    cues: ['how much', 'price', 'cost', 'total', 'rate', 'charge', 'expensive', 'cheap', 'discount', 'offer', 'cheaper', 'deal'],
    replies: [
      { text: 'It is [price] in total, including delivery.', when: 'Giving the full figure.' },
      { text: 'That comes to [price], plus [delivery fee] for delivery.', when: 'Delivery is separate.' },
      { text: 'I cannot change the price, but let me see if there is a promotion for you.', when: 'They push for a discount you cannot give.' }
    ]
  },
  {
    id: 'payment_method',
    group: 'payment',
    when: 'The conversation is about how to pay.',
    cues: ['pay', 'payment', 'cash', 'card', 'credit', 'debit', 'gcash', 'maya', 'bank transfer', 'online payment', 'on delivery', 'cod', 'invoice', 'pay after delivery', 'pay on delivery', 'how do i pay', 'how can i pay', 'payment link'],
    replies: [
      { text: 'We accept cash on delivery, card, or bank transfer. Which is easier for you?', when: 'Offering choices.' },
      { text: 'I will send the payment link to this number. Please confirm once it is paid.', when: 'Online payment.' },
      { text: 'Payment is collected by the driver when you receive the order.', when: 'Cash on delivery.' }
    ]
  },
  {
    id: 'payment_confirm',
    group: 'payment',
    when: 'They say they already paid, or ask if payment went through.',
    cues: ['i paid', 'already paid', 'payment sent', 'done the payment', 'receipt', 'transaction', 'confirmed payment', 'transfer done'],
    replies: [
      { text: 'Thank you. Let me verify the payment and confirm your order right away.', when: 'Never confirm before checking.' },
      { text: 'Could you send me a screenshot of the receipt, please?', when: 'You need proof.' },
      { text: 'I have your payment confirmed. Your order is now booked.', when: 'Verified — say it clearly.' }
    ]
  },
  {
    id: 'delivery_time',
    group: 'delivery',
    when: 'They ask when it will arrive.',
    cues: ['when will it', 'how long', 'delivery time', 'eta', 'what time', 'how soon', 'fast delivery', 'same day', 'next day', 'take long'],
    replies: [
      { text: 'Delivery takes about [time] from now. Is that okay for you?', when: 'Giving an estimate.' },
      { text: 'You can expect it between [start time] and [end time].', when: 'Always give a window, not an exact minute.' },
      { text: 'I will text you as soon as the driver leaves our place.', when: 'You cannot promise a time.' }
    ]
  },
  {
    id: 'order_status',
    group: 'delivery',
    when: 'They ask where their existing order is.',
    cues: ['where is my order', 'where my order', 'order status', 'still waiting', 'any update', 'update on my order', 'has it shipped', 'has it arrived', 'delivered yet', 'track', 'on the way', 'not received', 'not arrived', 'where is the driver', 'not here yet', 'no one came', { s: 'where is it', w: 6 }, { s: 'about my order', w: 7 }],
    replies: [
      { text: 'One moment while I check your order status.', when: 'You are looking it up now.' },
      { text: 'Your order is [status]. You will receive it by [time].', when: 'You found the answer.' },
      { text: 'I am checking with the driver and will call you back within [minutes] minutes.', when: 'You must ask someone else.' }
    ]
  },
  {
    id: 'delivery_address_check',
    group: 'delivery',
    when: 'Confirming where and when the driver goes.',
    cues: ['deliver it to', 'come pick up', 'pickup', 'pick up myself', 'change the address', 'different address', 'office', 'home'],
    replies: [
      { text: 'We will deliver to the address you confirmed. Please be available at that time.', when: 'Setting expectation.' },
      { text: 'Would you prefer to pick it up instead? That is faster.', when: 'Offering pickup.' },
      { text: 'I can change the address now. What is the new one?', when: 'Address is not final yet.' }
    ]
  },
  {
    id: 'out_of_stock',
    group: 'problem',
    when: 'You do not have what they want.',
    cues: ['out of stock', 'sold out', 'not available', 'no stock', 'finish', 'ended', 'unavailable', 'restock'],
    replies: [
      { text: 'I am sorry, that item is sold out today. May I offer you [similar item] instead?', when: 'Always give a next step.' },
      { text: 'It will be back on [date]. Would you like me to hold one for you?', when: 'They can wait.' },
      { text: 'We do not have that one, but these two are very similar. Shall I describe them?', when: 'Redirect to what you can sell.' }
    ]
  },
  {
    id: 'reschedule',
    group: 'problem',
    when: 'They want to move the time or date.',
    cues: ['change the time', 'reschedule', 'another day', 'tomorrow instead', 'deliver tomorrow', 'another time', 'different time', 'change the delivery', 'different date', 'move it', 'not available then'],
    replies: [
      { text: 'No problem. What day and time works better for you?', when: 'Taking the new slot.' },
      { text: 'I have moved your delivery to [new time]. Can you confirm that is correct?', when: 'After changing it.' },
      { text: 'That slot is taken, but I can offer you [time] or [time]. Which is better?', when: 'Giving only real options.' }
    ]
  },
  {
    id: 'cancel',
    group: 'problem',
    when: 'They want to cancel the order.',
    cues: ['cancel', 'stop the order', 'i dont want', 'drop it', 'refund my money', 'not receiving', 'wrong order i did not'],
    replies: [
      { text: 'I can cancel that for you. Can I ask the reason, so I can improve?', when: 'Cancel and gather feedback.' },
      { text: 'The order is already on the way, so cancellation may not be possible. Let me check now.', when: 'Too late to cancel — do not promise.' },
      { text: 'Done. Your order is cancelled and any payment will be refunded in [days] days.', when: 'Confirmed cancellation.' }
    ]
  },
  {
    id: 'refund',
    group: 'problem',
    when: 'They want their money back.',
    cues: ['refund', 'money back', 'return the money', 'reimburse', 'chargeback', 'not getting refund', 'how long refund'],
    replies: [
      { text: 'I understand. Let me process the refund for you now.', when: 'You have the authority.' },
      { text: 'Refunds take [days] working days to show on your side.', when: 'Setting the timeline.' },
      { text: 'I need approval for this refund. May I take your details and call you back today?', when: 'You must escalate — never say no.' }
    ]
  },
  {
    id: 'wrong_item',
    group: 'problem',
    when: 'They received the wrong or damaged item.',
    cues: ['wrong item', 'different item', 'damaged', 'broken', 'not what i ordered', 'missing item', 'incomplete', 'spoiled', 'expired', 'quality'],
    replies: [
      { text: 'I am sorry about that. Could you tell me exactly what you received?', when: 'Get the facts first.' },
      { text: 'You should not have to deal with this. I will arrange a replacement today.', when: 'Own the mistake.' },
      { text: 'Could you send a photo of the item? That helps me fix this faster.', when: 'Evidence speeds up the claim.' }
    ]
  },
  {
    id: 'angry',
    group: 'problem',
    when: 'The caller is upset or raising their voice.',
    cues: ['unacceptable', 'this is ridiculous', 'complaint', 'manager', 'supervisor', 'angry', 'frustrated', 'worst service', 'never again', 'very disappointed', 'scam'],
    replies: [
      { text: 'You are right to be upset, and I am sorry. Let me fix this for you.', when: 'Agree first, explain later.' },
      { text: 'I hear you. Please give me one minute to look into this properly.', when: 'Buys time without arguing.' },
      { text: 'I understand this is serious. I will pass this to my supervisor and you will hear from us today.', when: 'Escalate calmly.' }
    ]
  },
  {
    id: 'hold',
    group: 'survival',
    when: 'You need to stop typing or checking.',
    cues: ['are you there', 'hello', 'still there', 'waiting', 'why silent', 'can you hear'],
    replies: [
      { text: 'May I place you on hold for one moment?', when: 'Ask before silence.' },
      { text: 'Thank you for holding. I am still here with you.', when: 'Come back and acknowledge.' },
      { text: 'One moment please, I am pulling up your order.', when: 'Short wait, no hold needed.' }
    ]
  },
  {
    id: 'callback',
    group: 'survival',
    when: 'The line is dropping or you must call back.',
    cues: ['bad signal', 'cant hear', 'connection', 'call me back', 'call me later', 'line dropped', 'break up', 'reconnect'],
    replies: [
      { text: 'The line is breaking up. May I call you back on this number?', when: 'Signal is bad.' },
      { text: 'I will call you back in [minutes] minutes. Thank you for your patience.', when: 'Give a time you can keep.' },
      { text: 'Sorry, I did not catch that. Could you say it one more time?', when: 'You lost part of the sentence.' }
    ]
  },
  {
    id: 'business_hours',
    group: 'general',
    when: 'They ask when you are open or where you are.',
    cues: ['open', 'close', 'hours', 'what time are you', 'sunday', 'weekend', 'holiday', 'where are you located', 'your location', 'address of the store'],
    replies: [
      { text: 'We are open from [time] to [time], [days].', when: 'Standard hours.' },
      { text: 'We are closed now, but I can take your order and process it first thing tomorrow.', when: 'Turn a closed call into a sale.' },
      { text: 'Our store is at [address]. We also deliver to your area.', when: 'Location plus delivery reminder.' }
    ]
  },
  {
    id: 'upsell',
    group: 'order',
    when: 'You can add something to the sale.',
    cues: ['anything else', 'just that', 'thats all', 'one item', 'single'],
    replies: [
      { text: 'Would you like to add [item] to your order? It is only [price].', when: 'One clear suggestion, then stop.' },
      { text: 'If you order two, delivery is free. Would you like to add one more?', when: 'Bundle offer.' },
      { text: 'Perfect, that is all noted. Let me read the order back to you.', when: 'Close and confirm.' }
    ]
  },
  {
    id: 'closing',
    group: 'opening',
    when: 'The call is finished.',
    cues: ['thank you', 'thanks', 'ok bye', 'goodbye', 'have a good day', 'appreciate it', 'that is all', 'no nothing else'],
    replies: [
      { text: 'Thank you for calling. Have a great day!', when: 'Standard close.' },
      { text: 'You will get a text with the order details shortly. Thank you, and take care.', when: 'Close plus confirmation promise.' },
      { text: 'Is there anything else I can help you with today?', when: 'Before you end the call.' }
    ]
  },
  {
    id: 'confirm_reading',
    group: 'survival',
    when: 'You need to lock in everything before hanging up.',
    cues: ['correct', 'yes thats right', 'that is right', 'confirm', 'ok fine', 'sure', 'no not correct', 'wrong'],
    replies: [
      { text: 'Let me read the whole order back to you once more.', when: 'Do this on every order.' },
      { text: 'Thank you, everything is confirmed. I will process it now.', when: 'They agreed.' },
      { text: 'Sorry about that. Could you tell me which part is wrong?', when: 'They said no — find the bad detail.' }
    ]
  },
  {
    id: 'meeting_schedule',
    group: 'workplace',
    when: 'A client or colleague wants to book a meeting or a call.',
    cues: ['can we meet', 'schedule a call', 'set up a meeting', 'are you free', 'book a call', 'calendar invite', 'jump on a call', 'quick chat', 'reschedule the meeting'],
    replies: [
      { text: 'Yes, I can do [time]. I will send you the invite now.', when: 'Accept and take the admin.' },
      { text: 'What time works for you? I am in [timezone], so tell me your time zone too.', when: 'Avoid timezone mistakes.' },
      { text: 'Can we move it to [time]? Something came up that I must finish first.', when: 'Reschedule honestly, with a new time.' }
    ]
  },
  {
    id: 'task_clarify',
    group: 'workplace',
    when: 'They explain a task and you must be sure you got it.',
    cues: ['can you do', 'i need you to', 'please handle', 'send me the', 'you should', 'your task', 'take care of', 'follow up on', 'by the end of'],
    replies: [
      { text: 'Understood. I will do [task] and send it to you by [time]. Is that correct?', when: 'Say the task and the deadline back.' },
      { text: 'Two quick things: when do you need it, and should I send it by email or chat?', when: 'The two questions that prevent rework.' },
      { text: 'Could you send me the details in writing? I want to follow it exactly.', when: 'Never rely on memory for instructions.' }
    ]
  },
  {
    id: 'progress_update',
    group: 'workplace',
    when: 'They ask whether something is finished.',
    cues: ['is it done', 'any update', 'status update', 'did you finish', 'how is it going', 'when will you finish', 'have you sent', 'still pending'],
    replies: [
      { text: 'It is done. I sent it to you at [time]. Please confirm you received it.', when: 'Done, with proof.' },
      { text: 'It is half finished. I will complete it by [time] today.', when: 'Give a time you can keep.' },
      { text: 'I am blocked on [missing thing]. As soon as I have it, I will finish in [time].', when: 'Say why, not just "not yet".' }
    ]
  },
  {
    id: 'capacity',
    group: 'workplace',
    when: 'They give you more work than you can finish.',
    cues: ['one more thing', 'also can you', 'add this to your', 'asap', 'urgent task', 'right away', 'today itself', 'handle this too', 'quick turnaround'],
    replies: [
      { text: 'I can do it, but it will push [other task] to tomorrow. Which one should come first?', when: 'Let them choose the trade-off.' },
      { text: 'I can have it done by [time]. Is that soon enough, or do you need it right now?', when: 'Name a real time before agreeing.' },
      { text: 'I will not be able to do a good job on both today. I will take [task] and start [other task] tomorrow morning.', when: 'Polite no that protects quality.' }
    ]
  },
  {
    id: 'tech_trouble',
    group: 'workplace',
    when: 'A call or meeting has a technical problem.',
    cues: ['you are on mute', 'on mute', 'mute', 'cant hear you', 'your audio', 'bad connection', 'can you see my screen', 'you froze', 'broken up', 'call dropped', 'share your screen', 'camera off'],
    replies: [
      { text: 'Sorry, I am on mute now. Can you hear me clearly?', when: 'After unmuting.' },
      { text: 'My connection is not stable. Should I dial in by phone instead?', when: 'Give a backup plan, not an apology.' },
      { text: 'I can see your screen now. Let me repeat what I see so we are on the same page.', when: 'Confirm after a screen share.' }
    ]
  },
  {
    id: 'small_talk',
    group: 'workplace',
    when: 'They ask how you are, where you are based, or make friendly talk.',
    cues: ['how are you', 'good morning', 'where are you based', 'where are you from', 'what is your name', 'how old are you', 'weekend', 'how was your'],
    replies: [
      { text: 'I am well, thank you. How are you today?', when: 'Short, then give it back.' },
      { text: 'I am based in [location], and I work [timezone] hours.', when: 'They always ask this.' },
      { text: 'Good morning! Everything is going well here. Ready for today.', when: 'Positive and brief.' }
    ]
  },
  {
    id: 'agreement',
    group: 'workplace',
    when: 'They propose something and you must answer yes or no.',
    cues: ['is that okay', 'does that work', 'can you', 'would you mind', 'shall i', 'are we agreed', 'sound good', 'any problem with'],
    replies: [
      { text: 'Yes, that works for me.', when: 'Simple agreement.' },
      { text: 'That works, but I need one thing: [condition].', when: 'Agree with the one limit you have.' },
      { text: 'I am not able to do that one. I can do [alternative] instead.', when: 'Refuse and replace.' }
    ]
  }
];

/* Shown when nothing matched — a learner should never be left with a blank screen. */
const FALLBACK_REPLIES = [
  { text: 'Let me check that for you. One moment, please.', when: 'Safe when you are unsure.' },
  { text: 'Could you explain that a little more?', when: 'Buy time and get details.' },
  { text: 'Just to confirm, you would like [repeat their request], correct?', when: 'Read back what you heard.' }
];

/* Always-visible quick strip: the four lines used on every single call. */
const ESSENTIAL_LINES = [
  { text: 'Thank you for calling [business name]. How can I help you today?', when: 'Open' },
  { text: 'Sorry, could you please repeat that?', when: 'Did not understand' },
  { text: 'One moment please, let me check that for you.', when: 'Need time' },
  { text: 'Thank you for calling. Have a great day!', when: 'Close' }
];
