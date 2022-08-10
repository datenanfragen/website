// TODO: These don't belong here!

export const templates = {
    de: {
        'base::admonition': `Guten Tag,

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

Aufgrund des beschriebenen Sachverhalts gehe ich davon aus, dass die Verantwortliche gegen die DSGVO verstoßen hat. Daher wende ich mich nun mit meiner Beschwerde an Sie und bitte Sie, das beschriebene Verfahren im Rahmen Ihrer Befugnisse gemäß Art. 58 Abs. 1 DSGVO zu prüfen und die Verantwortliche anzuweisen, meiner Anfrage zu entsprechen.

Ich bitte Sie weiterhin, mich nach Art. 77 Abs. 2 DSGVO und Art. 57 Abs. 1 lit. f DSGVO im Laufe des Beschwerdeverfahrens, spätestens aber innerhalb von drei Monaten (vgl. Art. 78 Abs. 2 DSGVO), über dessen Stand und Ergebnisse zu informieren.

[allow_sharing_data_with_controller>Sie dürfen meine Daten zur Bearbeitung der Beschwerde an die Verantwortliche weitergeben.][not:allow_sharing_data_with_controller>Ich bitte Sie, meine Daten <bold>nicht</bold> an die Verantwortliche weitergeben.]

Sollten Sie weitere Informationen von mir benötigen, wenden Sie sich gerne an mich. Sie erreichen mich wie folgt:
{contact_details}
Ich bedanke mich bereits im Voraus für Ihre Unterstützung.

Mit freundlichen Grüßen`,

        'additional-id::admonition': `TODO`,
        'additional-id::you-said-that::issue': `TODO`,
        'additional-id::you-said-that::meta': `TODO`,
        'additional-id::complaint::persists': `TODO`,
        'additional-id::complaint::resolved': `TODO`,
        'id-copy::admonition': `TODO`,
        'id-copy::you-said-that::issue': `TODO`,
        'id-copy::you-said-that::meta': `TODO`,
        'id-copy::complaint::persists': `TODO`,
        'id-copy::complaint::resolved': `TODO`,
        'wrong-medium::admonition': `TODO`,
        'wrong-medium::you-said-that::issue': `TODO`,
        'wrong-medium::you-said-that::meta': `TODO`,
        'wrong-medium::complaint::persists': `TODO`,
        'wrong-medium::complaint::resolved': `TODO`,
        'signature::admonition': `TODO`,
        'signature::you-said-that::issue': `TODO`,
        'signature::you-said-that::meta': `TODO`,
        'signature::complaint::persists': `TODO`,
        'signature::complaint::resolved': `TODO`,
        'other-language::admonition': `TODO`,
        'other-language::you-said-that::issue': `TODO`,
        'other-language::you-said-that::meta': `TODO`,
        'other-language::complaint::persists': `TODO`,
        'other-language::complaint::resolved': `TODO`,
        'excessive::admonition': `TODO`,
        'excessive::you-said-that::issue': `TODO`,
        'excessive::you-said-that::meta': `TODO`,
        'excessive::complaint::persists': `TODO`,
        'excessive::complaint::resolved': `TODO`,
    },
    en: {
        'base::admonition': `To Whom It May Concern:

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

Based on the above, I believe that the controller has violated the GDPR. That is why I am lodging this complaint with you. I ask you to check the described procedure within the scope of your powers pursuant to Art. 58(1) GDPR, and to order the controller to comply with my request.

I further request that you inform me about the progress and the outcome of the complaint in accordance with Art. 77(2) GDPR and Art. 57(1)(f) GDPR during the course of the complaint procedure, but no later than within three months (Art. 78(2) GDPR).

[allow_sharing_data_with_controller>You may share my data with the controller for the purpose of processing the complaint.][not:allow_sharing_data_with_controller>I ask you <bold>not</bold> to share my data with the controller.]

If you need any more details, please feel free to contact me. You can reach me as follows:
{contact_details}
Thank you in advance for your assistance.

Yours sincerely,`,

        'additional-id::admonition': `You have refused to answer my request until I provide additional identification data. Please be aware that Art. 12(6) GDPR mandates that you may only request additional information if you have reasonable doubts concerning my identity.[no_doubts> You have not set forth any such doubts. They are not apparent, either.]

I am of the opinion that the data I have already provided in my request is sufficient to identify me and that you can thus not require me to provide any additional data.[has:reasoning> {reasoning}][concerns_online_account> Also note that Recital 64 GDPR explains that online identifiers should be used for identification, in particular in the context of online services, as is the case here.]`,
        'additional-id::you-said-that::issue': `the company refused to answer your request until you provide additional identification data.`,
        'additional-id::you-said-that::meta': `[no_doubts>You said that the company neither set forth any doubts regarding your identity, nor were they apparent.] You said that the data you provided in your request was sufficient for the following reason: [has:reasoning> “{reasoning}”][concerns_online_account> Your request concerns an online account.]`,
        'additional-id::complaint::persists': `The controller has refused to answer my request unless I provide additional identification data. But according to Art. 12(6) GDPR, they can only request additional information if they have reasonable doubts concerning my identity.[no_doubts> The controller has not set forth any such doubts. They are not apparent, either.]

I am of the opinion that the data I have already provided in my request is sufficient to identify me and that the controller can thus not require me to provide any additional data.[has:reasoning> {reasoning}][concerns_online_account> My request concerns an online account. Recital 64 GDPR explains that online identifiers should be used for identification.]`,
        'additional-id::complaint::resolved': `The controller had initially refused to answer my request unless I provide additional identification data, violating Art. 12(6) GDPR. This issue has since been resolved.`,

        'id-copy::admonition': `You have refused to answer my request until I provide a copy of an identity document. Please note that providing a copy of an identity document is an invasive measure that creates a risk for the security of my personal data, and is as such only appropriate if strictly necessary, suitable, and in line with national law (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 73).[user_objects> I do not believe that this is the case for my request.]
[not_linked_to_real_life_identity>My request concerns data that is not linked to my real-life identity. As such, it is not apparent how providing a copy of an identity document would help you in authenticating my request.][concerns_online_account>My request concerns an online account, which means that a better and less intrusive authentication procedure already exists (cf. Recital 64 GDPR). Consequently, it is disproportionate to require a copy of an identity document (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 72).][has:reasoning>
{reasoning}][ask_about_redactions>I am willing to provide a redacted copy of an identity document for this request but unfortunately you have not told me which information is necessary for confirming my identity. According to the European Data Protection Board, generally, the date of issue or expiry date, the issuing authority and the full name are sufficient, and all other information should be redacted (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 75). Please tell me which information you deem necessary so I can redact the rest.

I also want to point out in advance that storing the copy of my identity document longer than is necessary for verifying my identity for this request is an infringement of the GDPR considering the principles of storage and purpose limitation (Art. 5(1)(b) and (e) GDPR). The European Data Protection Board recommends making a note that you have verified my identity document and then immediately deleting the copy (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 78).][controller_requires_unredacted>I am willing to provide a copy of an identity document with the necessary information to identify me for this request but unfortunately you have told me that you only accept unredacted copies. Requiring an unredacted copy on an identify document is only legal in very narrow circumstances which I don’t think are met in this case. According to the European Data Protection Board, generally, the date of issue or expiry date, the issuing authority and the full name are sufficient, and all other information should be redacted (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 75). Please tell me which information you deem necessary so I can redact the rest.

As a precaution, I also want to already point out that storing the copy of my identity document longer than is necessary for verifying my identity for this request is an infringement of the GDPR considering the principles of storage and purpose limitation (Art. 5(1)(b) and (e) GDPR). The European Data Protection Board recommends making a note that you have verified my identity document and then immediately deleting the copy (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 78).]`,
        'id-copy::you-said-that::issue': `the company refused to answer your request until you provide a[controller_requires_unredacted>n unredacted] copy of an identity document.`,
        'id-copy::you-said-that::meta': `[user_objects>You said you don’t believe that asking for an ID copy was appropriate for this request for the following reason: ][not_linked_to_real_life_identity>Your request concerns data that is not linked to your real-life identity.][concerns_online_account>Your request concerns an online account.][has:reasoning>“{reasoning}”][controller_requires_unredacted>You said that the controller required you to submit an unredated ID copy for the request.]`,
        'id-copy::complaint::persists': `The controller has refused to answer my request unless I provide a copy of an identity document. According to the European Data Protection Board, this is only appropriate if strictly necessary, suitable, and in line with national law (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 73).[user_objects> I do not believe that this is the case for my request.]
[not_linked_to_real_life_identity>My request concerns data that is not linked to my real-life identity. As such, it is not apparent how providing a copy of an identity document would help the controller in authenticating my request.][concerns_online_account>My request concerns an online account, which means that a better and less intrusive authentication procedure already exists (cf. Recital 64 GDPR). Consequently, it is disproportionate to require a copy of an identity document (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 72).][has:reasoning>
{reasoning}][controller_requires_unredacted>I am willing to provide a copy of an identity document with the necessary information to identify me for this request but unfortunately the controller has told me that they only accept unredacted copies. But according to the European Data Protection Board, generally, the date of issue or expiry date, the issuing authority and the full name are sufficient, and all other information should be redacted (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 75).]`,
        'id-copy::complaint::resolved': `[user_objects>The controller had initially refused to answer my request unless I provide a copy of an identity document, which, according to the European Data Protection Board, is only appropriate if strictly necessary, suitable, and in line with national law (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 73).][controller_requires_unredacted>The controller had initially refused to answer my request unless I provide an unredacted copy of an identity document, but according to the European Data Protection Board, generally, the date of issue or expiry date, the issuing authority and the full name are sufficient, and all other information should be redacted (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 75).] This issue has since been resolved.`,

        'wrong-medium::admonition': `You have refused to answer my request [wrong_transport_medium>because it was not sent via {medium}.][not_form>unless I send it through your web form/self-service tool.][wrong_contact>claiming that it was sent to the wrong contact.] Please be aware that the GDPR doesn’t allow you to impose any additional formal requirements on requests (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 50). [wrong_transport_medium>This includes requiring requests to be sent via a particular transport medium (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 52).][not_form>This means that while you can offer such a self-service tool or web form for requests, you still have to comply with requests sent via other means (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, paras. 53, 136).][wrong_contact>While you are indeed not required to answer requests sent to random contacts not involved in the matter, you cannot only answer requests sent to a particular point of contact, either (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, paras. 55 et seq.).][wrong_contact_customer_service> I sent my request to your regular customer service/support contact. It is reasonable to expect you to correctly forward my request internally.][wrong_contact_privacy> I sent my request to the privacy contact you specified in your privacy policy. This is obviously a reasonable point of contact for such requests. If necessary, you should forward them to the correct person or department internally.][wrong_contact_dpo> I sent my request to your data protection officer, as specified in your privacy policy. Regardless of whether your data protection officer is tasked with responding to data subject requests, this is a reasonable point of contact for such requests. If necessary, you should forward them to the correct person or department internally.][has:wrong_contact_reasoning> {wrong_contact_reasoning}]`,
        'wrong-medium::you-said-that::issue': `the company refused to answer your request because you sent it to the wrong contact or via the wrong medium.`,
        'wrong-medium::you-said-that::meta': `You said that the company refused to answer your request because [wrong_transport_medium>it was not sent via {medium}.][not_form>you didn’t send it through their web form/self-service tool.][wrong_contact>it was sent to the wrong contact.] [wrong_contact_customer_service> You said that you sent your request to their regular customer service/support contact.][wrong_contact_privacy> You said that you sent your request to the privacy contact.][wrong_contact_dpo> You said that you sent your request to the data protection officer.][has:wrong_contact_reasoning> You said that the point of contact you sent your request to was reasonable for the following reason: “{wrong_contact_reasoning}”]`,
        'wrong-medium::complaint::persists': `The controller has refused to answer my request [wrong_transport_medium>because it was not sent via {medium}.][not_form>unless I send it through their web form/self-service tool.][wrong_contact>claiming that it was sent to the wrong contact.] The GDPR doesn’t allow controllers to impose any additional formal requirements on requests (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 50). [wrong_transport_medium>This includes requiring requests to be sent via a particular transport medium (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 52).][not_form>This includes requiring requests to be sent through a particular web form/self-service tool (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, paras. 53, 136).][wrong_contact>While I acknowledge that controllers are not required to answer requests sent to random contacts not involved in the matter, they cannot only answer requests sent to a particular point of contact, either (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, paras. 55 et seq.).][wrong_contact_customer_service> I sent my request to the controller’s regular customer service/support contact. It is reasonable to expect them to correctly forward my request internally.][wrong_contact_privacy> I sent my request to the privacy contact specified in the controller’s privacy policy. This is obviously a reasonable point of contact for such requests. If necessary, they should forward them to the correct person or department internally.][wrong_contact_dpo> I sent my request to the controller’s data protection officer, as specified in their privacy policy. Regardless of whether their data protection officer is tasked with responding to data subject requests, this is a reasonable point of contact for such requests. If necessary, they should forward them to the correct person or department internally.][has:wrong_contact_reasoning> {wrong_contact_reasoning}]`,
        'wrong-medium::complaint::resolved': `The controller had initially refused to answer my request [wrong_transport_medium>because it was not sent via {medium}.][not_form>unless I send it through their web form/self-service tool.][wrong_contact>claiming that it was sent to the wrong contact.] But the GDPR doesn’t allow controllers to impose any additional formal requirements on requests (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 50). This issue has since been resolved.`,

        'signature::admonition': `You have refused to answer my request unless I sign it. Please be aware that the GDPR doesn’t allow you to impose any additional formal requirements on requests (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 50). A signature can also not be used for authentication or identification.[not:signature_on_file> This is especially true since I have never provided you with my signature in the first place, so you have nothing you could even compare my signature against.]`,
        'signature::you-said-that::issue': `the company refused to answer your request unless you sign it.`,
        'signature::you-said-that::meta': `[not:signature_on_file>You said that the company doesn’t have your signature on file.][signature_on_file>You said that the company may have your signature on file.]`,
        'signature::complaint::persists': `The controller has refused to answer my request unless I sign it. The GDPR doesn’t allow controllers to impose any additional formal requirements on requests (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 50). A signature can also not be used for authentication or identification.[not:signature_on_file> This is especially true since I have never provided them with my signature in the first place, so they have nothing they could even compare my signature against.]`,
        'signature::complaint::resolved': `The controller had initially refused to answer my request unless I sign it. But the GDPR doesn’t allow controllers to impose any additional formal requirements on requests (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 50), and a signature can also not be used for authentication or identification[not:signature_on_file>, especially since I have never even provided the controller with a signature that they could compare against]. This issue has since been resolved.`,

        'other-language::admonition': `You have answered my request in {response_language}, even though my request was in {request_language}.[user_does_not_understand_response_language> I cannot understand your response in {response_language}.] According to Art. 12(1) GDPR, you have to provide communication related to requests in “easily accessible form, using clear and plain language”. According to the European Data Protection Board: “A controller that offers a service in a country should also offer answers in the language that is understood by the data subjects in that country.” (European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 140)
Please respond to my request in {request_language} instead.`,
        'other-language::you-said-that::issue': `the company responded to your request in a different language.`,
        'other-language::you-said-that::meta': `You said that the company responded in {response_language} to your request in {request_language}. You said that you[user_does_not_understand_response_language> don’t] understand the company’s response in {response_language}.`,
        'other-language::complaint::persists': `The controller has answered my request in {response_language}, even though my request was in {request_language}.[user_does_not_understand_response_language> I cannot understand the controller’s response in {response_language}.] According to Art. 12(1) GDPR, they have to provide communication related to requests in “easily accessible form, using clear and plain language”. According to the European Data Protection Board: “A controller that offers a service in a country should also offer answers in the language that is understood by the data subjects in that country.” (European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 140)`,
        'other-language::complaint::resolved': `The controller had initially answered my request in {response_language}, even though my request was in {request_language}[user_does_not_understand_response_language> and I couldn’t understand the controller’s response in {response_language}]. This issue has since been resolved.`,

        'excessive::admonition': `[controller_refuses>You have refused to act on my request.][controller_wants_to_charge>You want to charge a fee for my request.] According to Art. 12(5) GDPR, you can only do that for manifestly unfounded or excessive requests[controller_gave_no_reasoning> and you bear the burden of demonstrating the manifestly unfounded or excessive character of my request. You have not done that].[controller_wants_to_charge> Alternatively, you could charge a fee based on Art. 15(3) GDPR for further copies that I have requested.]

I don’t believe that you can [controller_refuses>refuse to act on my request][controller_wants_to_charge>charge me for my request] in this case[controller_gave_no_reasoning> and you have not argued to the contrary]. [first_request>This is the first request I have ever sent to you. As such, it is not apparent to me how it could possibly be considered unfounded or excessive. You can also never charge a fee for the first copy, regardless of whether you consider the cost of producing it to be too high (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 22).][additional_copy_no_prior_request>I have never sent you a request before. As such, it is not apparent how I could be asking for an additional copy of my data. You can never charge a fee for the first copy, regardless of whether you consider the cost of producing it to be too high (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 22).][concerns_different_data>You claim that I am asking for an additional copy of my data. However, this would only apply if this request concerned the same data as my previous request. If the request instead concerns different data (e.g. different data types or a different timeframe), you have to consider it a new request and the right to a free copy applies again (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 28). I believe that to be the case here.][has:reasoning>{reasoning}]`,
        'excessive::you-said-that::issue': `the company [controller_refuses>refused to act on your request][controller_wants_to_charge>wants to charge a fee for your request].`,
        'excessive::you-said-that::meta': `[controller_gave_no_reasoning>You said that the company didn’t give a reason.][first_request>You said that this was your first request to the company.][additional_copy_no_prior_request>You said that the company claimed you were asking for an additional copy of your data, but this was in fact your first request to them.][concerns_different_data>You said that the company claimed you were asking for an additional copy of your data, but you believe you were asking for different data.][has:reasoning>You gave your own reasoning: “{reasoning}”]`,
        'excessive::complaint::persists': `[controller_refuses>The controller refused to act on my request.][controller_wants_to_charge>The controller wants to charge a fee for my request.] According to Art. 12(5) GDPR, they can only do that for manifestly unfounded or excessive requests[controller_gave_no_reasoning> and they bear the burden of demonstrating the manifestly unfounded or excessive character of my request. They have not done that].[controller_wants_to_charge> Alternatively, they could charge a fee based on Art. 15(3) GDPR for further copies that I have requested.]

I don’t believe that they can [controller_refuses>refuse to act on my request][controller_wants_to_charge>charge me for my request] in this case[controller_gave_no_reasoning> and they have not argued to the contrary]. [first_request>This is the first request I have ever sent to the controller. As such, it is not apparent to me how it could possibly be considered unfounded or excessive. The controller can also never charge a fee for the first copy, regardless of whether they consider the cost of producing it to be too high (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 22).][additional_copy_no_prior_request>I have never sent a request to the controller before. As such, it is not apparent how I could be asking for an additional copy of my data. The controller can never charge a fee for the first copy, regardless of whether they consider the cost of producing it to be too high (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 22).][concerns_different_data>The controller claims that I am asking for an additional copy of my data. However, this would only apply if this request concerned the same data as my previous request. If the request instead concerns different data (e.g. different data types or a different timeframe), you have to consider it a new request and the right to a free copy applies again (cf. European Data Protection Board, “Guidelines 01/2022 on data subject rights - Right of access”, Version 1.0, para. 28). I believe that to be the case here.][has:reasoning>{reasoning}]`,
        'excessive::complaint::resolved': `[controller_refuses>The controller had initially refused to act on my request.][controller_wants_to_charge>The controller had initially wanted to charge a fee for my request.] According to Art. 12(5) GDPR, they can only do that for manifestly unfounded or excessive requests.[controller_wants_to_charge> Alternatively, they could charge a fee based on Art. 15(3) GDPR for further copies that I have requested.] This was not the case here. This issue has since been resolved.`,
    },
};
