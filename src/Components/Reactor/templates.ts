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
{company}

Meine Beschwerde bezieht sich auf eine Anfrage nach Art. <request_article> DSGVO, die ich an die Verantwortliche gerichtet habe. Im Rahmen dieser Anfrage hat die folgende Korrespondenz zwischen der Verantwortlichen und mir stattgefunden:

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
    },
    // TODO: Translate.
    en: {
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
{company}

Meine Beschwerde bezieht sich auf eine Anfrage nach Art. <request_article> DSGVO, die ich an die Verantwortliche gerichtet habe. Im Rahmen dieser Anfrage hat die folgende Korrespondenz zwischen der Verantwortlichen und mir stattgefunden:

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

        'additional-id::response': `You have refused to answer my request until I provide additional identification data. Please be aware that Art. 12(6) GDPR mandates that you may only request additional information if you have reasonable doubts concerning my identity.[no_doubts> You have not set forth any such doubts. They are not apparent, either.]

I am of the opinion that the data I have already provided in my request is sufficient to identify me and that you can thus not require me to provide any additional data.[has:reasoning> {reasoning}][concerns_online_account> Also note that Recital 64 GDPR explains that online identifiers should be used for identification, in particular in the context of online services, as is the case here.]`,
        'additional-id::complaint::': `TODO`,
    },
};
