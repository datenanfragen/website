// TODO: These don't belong here!

export const templates = {
    de: {
        'base::response': `Guten Tag,

am {request_date} hatte ich eine Anfrage nach Art. {request_article} DSGVO an Sie gerichtet.[controller_responded> Ich nehme Bezug auf Ihre Antwort darauf vom {response_date}.]
[has:issue_list>
Leider bin ich aus den folgenden Gründen nicht der Meinung, dass Sie meine Anfrage ausreichend entsprechend der Vorgaben der DSGVO beantwortet haben:

{issue_list}
][has:additional_data_list>
Ich reiche die folgenden Informationen nach, wie von Ihnen erbeten:

{additional_data_list}
][has:issue_list>
Ich wende mich daher hiermit erneut an Sie und fordere Sie auf, meine Anfrage innerhalb von zwei Wochen ab Eintreffen dieser Mahnung zufriedenstellend zu beantworten. Andernfalls behalte ich mir vor rechtliche Schritte gegen Sie einzuleiten und Beschwerde bei der zuständigen Datenschutzaufsichtsbehörde einzureichen.
]
Vielen Dank.

Mit freundlichen Grüßen`,
        'base::complaint': `Guten Tag,

hiermit reiche ich Beschwerde nach Art. 77 DSGVO gegen folgende Verantwortliche ein:
{request_recipient_address}

Meine Beschwerde bezieht sich auf eine Anfrage nach Art. {request_article} DSGVO, die ich an die Verantwortliche gerichtet habe. Im Rahmen dieser Anfrage hat die folgende Korrespondenz zwischen der Verantwortlichen und mir stattgefunden:

{correspondence_list}

Die Korrespondenz mit der Verantwortlichen habe ich Ihnen an diese Beschwerde angehängt.

Ich bin der Ansicht, dass die Verantwortliche meine Rechte durch ihre Handhabung meiner Anfrage aus den folgenden Gründen verletzt hat:

{issue_list}

Aufgrund des beschriebenen Sachverhalts gehe ich davon aus, dass die Verantwortliche gegen die DSGVO verstoßen hat. Daher wende ich mich nun mit meiner Beschwerde an Sie und bitte Sie, das beschriebene Verfahren im Rahmen Ihrer Befugnisse gemäß Art. 58 Abs. 1 DSGVO zu prüfen. Ich rege die folgenden sowie ggf. alle weiteren nach Ihrem Ermessen nötigen aufsichtsbehördlichen Maßnahmen an:

{petition_list}

Ich bitte Sie weiterhin, mich nach Art. 77 Abs. 2 DSGVO und Art. 57 Abs. 1 lit. f DSGVO im Laufe des Beschwerdeverfahrens, spätestens aber innerhalb von drei Monaten (vgl. Art. 78 Abs. 2 DSGVO), über dessen Stand und Ergebnisse zu informieren.
[allow_sharing_data_with_controller>
Sie dürfen meine Daten zur Bearbeitung der Beschwerde an die Verantwortliche weitergeben.
]
Sollten Sie weitere Informationen von mir benötigen, wenden Sie sich gerne an mich. Sie erreichen mich wie folgt:
{contact_details}

Ich bedanke mich bereits im Voraus für Ihre Unterstützung.

Mit freundlichen Grüßen`,

        'additional-id::response': `TODO`,
        'additional-id::complaint::': `TODO`,
        'id-copy::response': `TODO`,
        'id-copy::complaint': `TODO`,
    },
    en: {
        'base::response': `To Whom It May Concern:

on {request_date} I sent you a request according to Art. {request_article} GDPR.[controller_responded> I refer to your response dated {response_date}.]
[has:issue_list>
Unfortunately, for the following reasons, I do not believe that you have sufficiently responded to my request in accordance with the requirements of the GDPR:

{issue_list}
][has:additional_data_list>
I am providing the following additional information as requested by you:

{additional_data_list}][has:issue_list>
That is why I am contacting you again. I request that you adequately respond to my request within two weeks from the date of receipt of this message. Otherwise, I reserve the right to take legal action against you and to lodge a complaint with the responsible supervisory authority.
]
Thank you.

Yours sincerely,`,
        'base::complaint': `To Whom It May Concern:

I am hereby lodging a complaint according to Art. 77 GDPR against the following controller:
{request_recipient_address}

My complaint concerns a request according to Art. {request_article} GDPR that I sent to the controller. In the context of this request, the following correspondence has taken place between the controller and me:

{correspondence_list}

I have attached the correspondence with the controller to this complaint.

I believe that the controller has violated my rights by its handling of my request for the following reasons:

{issue_list}

Based on the above, I believe that the controller has violated the GDPR. That is why I am lodging this complaint with you. I ask you to check the described procedure within the scope of your powers pursuant to Art. 58(1) GDPR. I suggest the following, as well as any further supervisory action that you may deem necessary:

{petition_list}

I further request that you inform me about the progress and the outcome of the complaint in accordance with Art. 77(2) GDPR and Art. 57(1)(f) GDPR during the course of the complaint procedure, but no later than within three months (Art. 78(2) GDPR).
[allow_sharing_data_with_controller>
You may share my data with the controller for the purpose of processing the complaint.
]
If you need any more details, please feel free to contact me. You can reach me as follows:
{contact_details}

Thank you in advance for your assistance.

Yours sincerely,`,

        'additional-id::response': `You have refused to answer my request until I provide additional identification data. Please be aware that Art. 12(6) GDPR mandates that you may only request additional information if you have reasonable doubts concerning my identity.[no_doubts> You have not set forth any such doubts. They are not apparent, either.]

I am of the opinion that the data I have already provided in my request is sufficient to identify me and that you can thus not require me to provide any additional data.[has:reasoning> {reasoning}][concerns_online_account> Also note that Recital 64 GDPR explains that online identifiers should be used for identification, in particular in the context of online services, as is the case here.]`,
        'additional-id::complaint::': `TODO`,
        'id-copy::response': `You have refused to answer my request until I provide a copy of an identity document. Please note that providing a copy of an identity document is an invasive measure that creates a risk for the security of my personal data, and is as such only appropriate if strictly necessary, suitable, and in line with national law (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 73).[user_objects> I do not believe that this is the case for my request.]
[not_linked_to_real_life_identity>My request concerns data that is not linked to my real-life identity. As such, it is not apparent how providing a copy of an identity document would help you in authenticating my request.][concerns_online_account>My request concerns an online account, which means that a better and less intrusive authentication procedure already exists (cf. Recital 64 GDPR). Consequently, it is disproportionate to require a copy of an identity document (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 72).][has:reasoning>
{reasoning}][ask_about_redactions>I am willing to provide a redacted copy of an identity document for this request but unfortunately you have not told me which information is necessary for confirming my identity. According to the European Data Protection Board, generally, the date of issue or expiry date, the issuing authority and the full name are sufficient, and all other information should be redacted (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 75). Please tell me which information you deem necessary so I can redact the rest.

I also want to point out in advance that storing the copy of my identity document longer than is necessary for verifying my identity for this request is an infringement of the GDPR considering the principles of storage and purpose limitation (Art. 5(1)(b) and (e) GDPR). The European Data Protection Board recommends making a note that you have verified my identity document and then immediately deleting the copy (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 78).]`,
        'id-copy::complaint': `TODO`,
    },
};
