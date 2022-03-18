{
    "title": "Was haben wir letztes Jahr gemacht? Unser Jahresbericht für 2019",
    "slug": "jahresbericht-2019",
    "date": "2020-04-15T13:37:00+02:00",
    "type": "blog",
    "description": "Das zweite Jahr des Datenanfragen.de e. V. liegt hinter uns. In unserem Jahresbericht blicken wir zurück auf 2019 und geben einen Überblick über unsere Ziele für 2020.",
    "authors": [ "baltpeter", "zner0l" ],
    "featured_image": "jahresbericht-2019",
    "license": "cc-by-40"
}

Das zweite Jahr des Datenanfragen.de e.&nbsp;V. liegt hinter uns. In diesem Jahr konnten wir vieles dazu gewinnen: neue Mitglieder, die unsere Arbeit unterstützen wollen, neue Mitwirkende, die kurz- und langfristig am Projekt mitarbeiten, Unterstützung für eine komplett neue Sprache und neue Stabilität im Betrieb der Webseite. Im letzten Jahr stand unser Projekt oft im Zeichen der Vereinfachung: leichterer Zugang für Menschen mit eingeschränker Sehfähigkeit, leichtere Bedienung des Generators (auch wenn hier noch viele Baustellen offen sind) und - was uns besonders freut - leichterer Zugang zur Mitarbeit am Projekt.

{{< featuredImg alt="Titelgrafik zum Jahresbericht 2019" link="https://static.dacdn.de/docs/bericht-2019.pdf" >}}

In diesem Artikel wollen wir Euch einen Überblick darüber geben, was wir letztes Jahr gemacht haben und was unsere Ziele für 2020 sind. Dieser Artikel ist ein Auszug aus unserem Jahresbericht für 2019. Im vollständigen Jahresbericht, den Ihr [als PDF herunterladen](https://static.dacdn.de/docs/bericht-2019.pdf) könnt, erfahrt Ihr noch mehr.

## Unser Jahr 2019

### Webseite und Generator

Nachdem wir 2018, in unserem ersten Jahr, bereits die Grundfunktionen des Generators und der Webseite umsetzen konnten, haben wir diese 2019 noch deutlich erweitert. Wir haben neue Funktionen eingebaut, welche die Anwendungsfälle, die wir abdecken können, erweitern und die Benutzung einfacher machen, aber gleichzeitig auch an bestehenden Funktionen geschraubt und Fehler behoben.

So unterstützt der Generator zusätzlich zu den bisherigen Anfragetypen nun auch den Werbewiderspruch nach Art. 21 Abs. 2 DSGVO. Dieses Recht bietet Verbraucher_innen eine wertvolle Möglichkeit, sich gegen unerwünschte Werbung von Unternehmen zu wehren und wir wurden von mehreren Nutzer_innen gebeten, entsprechende Anfragen zu unterstützen. Wie üblich bieten wir natürlich auch für den Werbewiderspruch einen {{< link slug="blog/sample-letter-gdpr-direct-marketing-objection" text="Musterbrief" >}} an, der vollkommen unabhängig von der Webseite genutzt werden kann.

Eine weitere Neuerung im Generator ist die bessere Unterstützung von Trackingunternehmen. Diese sammeln unsere Daten, während wir uns im Internet bewegen, häufig mit dem Ziel, auf die Nutzer_in angepasste Werbung ausliefern zu können. Meistens speichern diese Unternehmen nicht etwa Name oder Adresse zu den Personen, die sie verfolgen. Stattdessen nutzen sie eindeutige pseudonymisierte Identifizierungsmerkmale in Form von *Cookies* oder sog. *Advertising IDs*. Dementsprechend haben wir den Generator für solche Unternehmen so angepasst, dass die generierten Schreiben eine Aufforderung enthalten, zu erklären, wie die entsprechenden Identifizierungsmerkmale von der Nutzer_in ausgelesen werden können, damit die Anfrage bearbeitet werden kann.

Mithilfe der Erfahrungen, die wir in unserem ersten Jahr gesammelt haben, konnten wir die Entscheidungen, welche wir in der frühen Entwicklung getroffen haben, kritisch hinterfragen und sind bei einigen zu dem Schluss gekommen, dass eine Veränderung sinnvoll ist.  
So fragt der Generator nun standardmäßig weniger Identizierungsdaten ab. Ursprünglich haben wir unseren Nutzer_innen empfohlen, neben Namen und Adresse auch ihr Geburtsdatum in die Anfragen aufzunehmen. Mittlerweile wissen wir aber, dass dies für die allermeisten Fälle nicht nötig ist. Bei Unternehmen, von denen wir wissen, dass sie das Geburtsdatum benötigen, fragen wir es aber natürlich weiterhin ab.  
Weiterhin hatten wir zunächst empfohlen, Anfragen per Fax zu verschicken. Diese Standardeinstellung haben wir revidiert und empfehlen mittlerweile den Versand per E-Mail, da viele Verbraucher_innen nicht über ein Faxgerät verfügen und wir so die Hürde zum Anfragenstellen nur unnötig hoch legen würden. Diese Entscheidung wurde uns insbesondere dadurch erleichtert, dass viele Unternehmen seit dem Inkrafttreten der DSGVO spezielle E-Mail-Adressen eingerichtet haben, welche direkt an die_den Datenschutzbeauftragten oder die Datenschutzabteilung gehen.

{{< img name="meine-anfragen" caption="Die neue Ansicht der bereits gestellten Anfragen" >}}

Aber auch an anderen Stellen der Webseite hat sich etwas getan. So haben wir begonnen, die *Meine Anfragen*-Funktion auszubauen, über welche Nutzer_innen ihre bereits gestellten Anfragen einsehen können. Hier haben wir angefangen, die Darstellung klarer zu gestalten, aber auch neue Funktionen eingeführt. So können Nutzer_innen nun etwa ihre Anfragen in den eigenen Kalender exportieren, um so über das Ablaufen der Fristen informiert zu werden, ohne dass wir irgendwelche Daten dazu verarbeiten müssen. Diese Funktionen wollen wir im nächsten Jahr noch weiter ausbauen.

Weiterhin haben wir die Übersetzung der Webseite durch die Community erleichtert, da wir nun die Open-Source-Übersetzungsplattform Weblate benutzen. Diese Plattform erleichtert nicht nur uns intern die Verwaltung der Übersetzungen, sondern erlaubt vor allem auch jedem, [neue Übersetzungen beizutragen](https://hosted.weblate.org/engage/datenanfragen-de/) oder alte zu korrigieren – sei es eine einzelne Zeile oder die gesamte Webseite.  
Diese Maßnahme hat 2019 auch schon erste Früchte getragen: So können wir unsere komplette Webseite jetzt auch auf Französisch unter der Adresse [demandetesdonnees.fr](https://www.demandetesdonnees.fr/) anbieten.

Ein weiterer Fokus lag auf der Barrierefreiheit. Unser Ziel, die DSGVO und unsere Werkzeuge möglichst vielen Menschen zugänglich zu machen, schließt selbstverständlich auch Menschen mit Beeinträchtigungen ein. Als ersten Schritt haben wir unser Farbkonzept überarbeitet, sodass es jetzt nicht nur deutlich angenehmer anzuschauen ist, sondern vor allem auch strikten Vorgaben an den minimalen Kontrast zwischen Elementen entspricht. Dann haben wir mithilfe von automatisierten Tools nach noch vorhandenen Problemen, etwa in der Struktur der Seite, gesucht und diese behoben. Durch diese Veränderungen wird bspw. die Benutzung der Webseite mit einem Screenreader erleichert. Obwohl wir in diesem Bereich schon deutliche Fortschritte gemacht haben, gibt es noch einiges zu tun und wir behalten die Barrierefreiheit dauerhaft im Hinterkopf.

Und schließlich hat sich auch im Hintergrund in technischer Hinsicht einiges getan. Wir haben den Generator grundlegend umgebaut und optimiert, sodass wir darauf aufbauend in Zukunft für bestimmte Zwecke angepasste Masken erstellen können, etwa für Kampagnen. Wir haben unsere sog. *Continuous Integration*- und Testinfrastruktur deutlich ausgebaut. Mithilfe dieser Infrastruktur wird die Webseite bei jeder Änderung automatisch überprüft, sodass die Gefahr, aus Versehen Fehler einzubauen, verringert wird. Auch unsere Werkzeuge für Entwickler_innen haben wir ausgebaut.

### Informationsmaterial und Öffentlichkeitsarbeit

Neben der Webseite sind auch unser Informationsmaterial und unsere Öffentlichkeitsarbeit wichtige Teile des Projekts. Sie ermöglichen es uns, eine größere Zahl an Menschen zu erreichen und über ihre Verbraucher_innenrechte aufzuklären. Auch dieses Angebot haben wir 2019 weiter ausgebaut.

Die erste Neuerung hier sind unsere sog. *Act-Seiten*. Diese Seiten sind im Grunde genommen normale Blogartikel mit einem Aufruf zum Handeln für die eigenen Datenschutzrechte, aber sie haben eine spezielle, stark vereinfachte Version unseres Generators eingebaut, die sich nur für einen bestimmten Zweck nutzen lässt. Über diesen Generator können die Nutzer_innen dann in der Regel direkt eine Anfrage an das im Artikel erwähnte Unternehmen schicken. Wir nutzen die Act-Seiten quasi als Mini-Kampagnen. Sie erlauben es uns, schnell und ohne große Vorarbeit auf das aktuelle Tagesgeschehen im Datenschutz zu reagieren. Gibt es beispielsweise wieder einmal einen Datenskandal, können wir in kurzer Zeit eine Act-Seite dafür erstellen und Verbraucher_innen so ermöglichen, Ihre Rechte direkt in Form einer Anfrage wahrzunehmen. Dadurch haben wir eine wertvolle Gelegenheit, neue Nutzer_innen zu erreichen, die noch keinen Kontakt mit ihren Datenschutzrechten hatten und vielleicht selbstständig nicht danach suchen würden.  
Im letzten Jahr haben wir drei Act-Seiten veröffentlicht: Im August 2019 hat der Essenslieferant *Deliveroo* überraschend seinen Dienst eingestellt. Über unsere {{< link slug="act/deliveroo" text="Act-Seite" >}} konnten Verbraucher_innen einfach die Löschung der verbliebenen Daten fordern. Im Oktober 2019 machte die Gesundheitsapp *Ada Health* wegen ihrer schlechten Datenschutzpraktiken Negativschlagzeilen. Auch hier erlaubte unsere {{< link slug="act/ada-health" text="Act-Seite" >}}, die Löschung der eigenen Daten zu verlangen. Im November 2019 verhängte die Berliner Datenschutzbeauftragte ein Bußgeld gegen das Immobilienunternehmen *Deutsche Wohnen* wegen gravierender Datenschutzmängel in deren Archivsystem und empfahl Verbraucher_innen eine Auskunftsanfrage zu stellen. Das haben wir über unsere {{< link slug="act/deutsche-wohnen" text="Act-Seite" >}} mit wenigen Klicks ermöglicht.

Auch unsere regulären {{< link slug="blog" text="Bloginhalte" >}} haben wir erweitert. So haben wir jetzt ein {{< link slug="blog/gdpr-cheat-sheet" text="Glossar" >}}, das wichtige Begriffe und Konzepte aus der DSGVO verständlich und auf den Punkt gebracht erklärt. Darüber hinaus haben wir einen umfangreichen Artikel, welcher den {{< link slug="blog/supervisory-authorities" text="Beschwerdeweg über die Datenschutz-Aufsichtsbehörden" >}} erläutert. In diesem Artikel findet sich auch unser neuer {{< link slug="supervisory-authorities#finder" text="Datenschutz-Aufsichtsbehörden-Finder" >}}, welcher anhand einiger einfacher Fragen ermittelt, an welche Aufsichtsbehörde sich Verbraucher_innen in welchem Fall wenden sollten.  
In den Kommentaren unter unseren Artikeln und Unternehmenseinträgen findet weiter ein reger Austausch zwischen Nutzer_innen statt. Hier werden Fragen zu den besprochenen Themen gestellt und beantwortet, Vorschläge für das Projekt gemacht und Erfahrungen mit Unternehmen geteilt.
Darüber hinaus haben wir auch angefangen, unsere Inhalte in weiteren Formen als Artikeln auf der Webseite zugänglich zu machen. Den Anfang macht hier unser neuer [Flyer](https://static.dacdn.de/docs/flyer-deine-dsgvo-rechte.pdf) „Deine DSGVO-Rechte: Ein Überblick über die Rechte für Verbraucher_innen nach der Datenschutz-Grundverordnung“. Dieser Flyer gibt einen ersten Überblick über die wichtigsten DSGVO-Rechte. Er erklärt ein einfaches Schema zur Nutzung dieser Rechte und verweist auf einige unserer Angebote.  
Um unsere Informationsmaterialien möglichst leicht zugänglich zu machen, haben wir eine {{< link slug="verein/material" text="Unterseite" >}} eingeführt, welche diese auflistet und die Bestellung von Material ermöglicht, um es etwa im Bekanntenkreis oder bei Veranstaltungen zu verteilen.

Im Dezember konnten wir, einer Einladung des CCC Göttingen folgend, eine Informationsveranstaltung zu Datenanfragen.de und zum Stellen von Anfragen durchführen, bei der wir über die Funktionsweise der Webseite und den Ablauf von Anfragen aufgeklärt haben.

Schließlich haben wir 2019 zum ersten Mal beim {{< link slug="blog/hacktoberfest-2019" text="Hacktoberfest" >}} teilgenommen. Das Hacktoberfest ist eine vom Hosting-Anbieter DigitalOcean ausgerufenes Ereignis, das Menschen anregen soll, Beiträge zu Open-Source-Projekten zu leisten. Dafür schenkt DigitalOcean den Teilnehmenden ein spezielles T-Shirt. Neben diesem offiziellen Ereignis nutzen jedes Jahr auch zahlreiche weitere Unternehmen und Organisationen die Gelegenheit, sich am Hacktoberfest zu beteiligen und zusätzlich weitere Belohnungen für bestimmte Beiträge anzubieten. Wir haben für Beiträge zu unserem Projekt ein Stickerset verteilt und die besten zehn Einreichungen zusätzlich mit einem T-Shirt belohnt.  
Unsere Teilnahme war ein voller Erfolg. Wir konnten dadurch nicht nur zahlreiche Menschen auf das Projekt aufmerksam machen und sie dafür begeistern, sich bei uns einzubringen, sondern haben auch tolle Beiträge erhalten. Einige der Neuerungen, die wir hier erwähnt haben, wurden von Teilnehmenden unserer Hacktoberfestaktion beigetragen.

### Datenbank

Die Datenbank von Datenschutzkontakten für Unternehmen ist der letzte wichtige Teil von Datenanfragen.de. Sie erleichtert Verbraucher_innen das Stellen von Anfragen an Unternehmen, Behörden und andere Organisationen erheblich. Mittlerweile haben wir mehr als 1300 Einträge in der Datenbank.

Ein stetig wachsender Anteil der neuen Einträge stammt dabei von Nutzer_innen, welche über die Webseite {{< link slug="suggest" text="Vorschläge zu neuen Unternehmen einreichen" >}}. Durch diese Vorschläge landen auch immer mehr Unternehmen aus anderen Ländern in der Datenbank, sodass wir mittlerweile neben Deutschland zwölf weitere Länder unterstützen können, darunter Österreich, Frankreich und Portugal.

Um weitere Personen zu Beiträgen zu ermutigen, haben wir 2019 daran gearbeitet, den Vorschlagsprozess zu optimieren und das entsprechende Formular einfacher bedienbar zu machen. So haben wir die Darstellung verbessert und weniger relevante Elemente, die nur selten ausgefüllt werden, versteckt, um Nutzer_innen nicht zu verwirren. Auch haben wir die Möglichkeit eingeführt, den Status des Vorschlages direkt über *GitHub* zu verfolgen.

Auch die Überprüfung der Unternehmensvorschläge haben wir erleichtert. So werden gewisse Felder wie die Telefon- und Faxnummer nun automatisch entsprechend unserer Vorgaben in ein einheitliches Format gebracht. Felder, welche die Nutzer_innen freigelassen haben, werden soweit möglich mit sinnvollen Standardwerten befüllt. Und das Tool zum Überprüfen der Vorschläge hat einige nützliche neue Funktionen erhalten.

## Ziele für 2020

Für 2020 haben wir uns wieder viel vorgenommen. Wie wir es im letzten Jahr bereits begonnen hatten, möchten wir in 2020 mit dem Ausbau der *Meine Anfragen*-Funktion weitermachen. Wir wünschen uns mehr Möglichkeiten zur Verwaltung der Korrespondenz mit den Verantwortlichen, einen effektiven Ex- und Import der Daten, um die Übertragbarkeit zu anderen Geräten bzw. Browsern zu gewährleisten, und eine umfangreiche Statusverwaltung, mit welcher der aktuelle Stand der Anfragen zentral vermerkt werden kann. Damit wollen wir es leichter machen, viele Anfragen zu stellen, ohne die Übersicht zu verlieren.

Daran anschließend ist unser stetiges Streben nach besserer Usability: Der Generator ist mit seinen vielen Funktionen unübersichtlich und abschreckend für neue Nutzer_innen und insbesondere Einsteiger_innen. Wir möchten einen klareren Nutzungsfluss etablieren und die Nutzer_innen stärker durch die Seite leiten, ohne dass Expert_innen auf Sonderfunktionen verzichten müssen. In 2020 möchten wir deshalb zumindest beginnen, den Generator auf eine andere Bedienweise umzustellen und mehr im Wizard-Format anzubieten.

Auch im Sinne der besseren Bedienbarkeit, wollen wir in 2020 unser Informationsangebot ausweiten, mit mehr einfachen Artikeln, die sich rund um die Fragen der Antragsstellung drehen und zur DSGVO aufklären. Denkbar wären auch weitere Printangebote, in denen etwa Artikel zusammengefasst sind.
Um die Reichweite der Webseite zu erhöhen und das Angebot insgesamt auf eine breitere Basis zu stellen, suchen wir nach Partner_innen und Freund_innen, die uns unterstützen und mit uns an einem Strang ziehen. Im kommenden Jahr wollen wir deshalb unsere Netzwerke verstärken, sowohl mit anderen Mitstreiter_innen im Datenschutz als auch mit neuen Mitgliedern und Mitwirkenden.

{{< img name="mastodon-toot" caption="Über Mastodon und Twitter wollen wir mehr über Datenanfragen.de informieren" >}}

Dafür ist auch eine breitere Kommunikation nötig. Deshalb wollen wir unseren Newsletter auf die Beine stellen und uns mehr auf unseren Social-Media-Kanälen bei [Mastodon](https://mastodon.social/@DatenanfragenDE) und [Twitter](https://twitter.com/DatenanfragenDE) bemerkbar machen. Dort wollen wir neue Angebote bewerben und über unsere Arbeit berichten.

## Unsere Finanzen in 2019

Unsere Projekte brauchen nicht nur Arbeit, sie kosten auch Geld. Das ist der Hauptgrund dafür, dass wir Spenden sammeln und Mitgliedsbeiträge erheben. 

Damit Ihr Euch sicher sein könnt, was genau mit Euren Beiträgen und Spenden passiert, wollen wir Euch hier einen Überblick über unsere Finanzen geben. Dabei orientieren wir uns am **Standardkontenrahmen 49** (SKR49).

### Gewinn- und Verlustrechnung

Erfreulicherweise können wir für 2019 von einem Anstieg der Einnahmen durch Mitgliedsbeiträge um mehr als 100&nbsp;€ berichten und auch das Spendenvolumen ist in diesem Jahr angewachsen. Insgesamt konnten wir 408,66&nbsp;€ durch Spenden und Mitgliedsbeiträge einnehmen. Durch den Umzug der Infrastruktur aus privaten Accounts zum Verein sind die Serverkosten angestiegen. Durch einen mittlerweile abgelaufenen Gutschein für die kostenlose Nutzung von Serverressourcen bei Amazon blieben sie aber im Jahr 2019 vergleichsweise gering. Für 2020 rechnen wir hier mit einem erneuten Anstieg. Die übrigen Posten sind neben den Kosten für die Vereinsverwaltung, die so ähnlich bereits letztes Jahr angefallen sind, vor allem Druckkosten für Informationmaterial in Höhe von 80,42&nbsp;€. Daneben sind es die Kosten, die für Dankeschöns im Zuge das Hacktoberfests angefallen sind, insgesamt haben wir für dieses 138,23&nbsp;€ ausgegeben. Ein Großteil der gedruckten Sticker ist allerdings übrig und wird weiterhin als Dankeschön zur Mitwirkung am Projekt verwendet.

Insgesamt haben wir im Jahr 2019 so einen Verlust von 31,80&nbsp;€ erwirtschaftet, den wir aus Rücklagen vom Vorjahr vollständig tilgen konnten.

<style>
table#guv-table tr td:nth-child(1) { text-align: left; }
table#guv-table tr td:nth-child(2), table#guv-table tr td:nth-child(3) { text-align: right; }
</style>
<table id="guv-table" class="table fancy-table fancy-table-mobile">
  <thead>
    <tr class="bg-blue-700 color-white">
      <th scope="col" class="align-left">Buchungsart</th>
      <th scope="col" class="align-right">Einnahmen</th>
      <th scope="col" class="align-right">Ausgaben</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Ideeller Bereich</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Echte Mitgliedsbeiträge bis 300 Euro</td>
      <td>308,00 €</td>
      <td>0,00 €</td>
    </tr>
    <tr>
      <td>Porto, Telefon, DSL</td>
      <td>0,00 €</td>
      <td class="color-red-700">-51,99 €</td>
    </tr>
    <tr>
      <td>Repräsentationsskosten</td>
      <td>0,00 €</td>
      <td class="color-red-700">-128,01 €</td>
    </tr>
    <tr>
      <td>Vereinsmitteilungen</td>
      <td>0,00 €</td>
      <td class="color-red-700">-15,86 €</td>
    </tr>
    <tr>
      <td>Bankverwaltungskosten</td>
      <td>0,00 €</td>
      <td class="color-red-700">-25,23 €</td>
    </tr>
    <tr>
      <td>Server- und Domainkosten</td>
      <td>0,00 €</td>
      <td class="color-red-700">-164,92 €</td>
    </tr>
    <tr class="border-bottom">
      <td>Mitmachdankeschön</td>
      <td>0,00 €</td>
      <td class="color-red-700">-54,45 €</td>
    </tr>
    <tr>
      <td>Saldo Ideeller Bereich</td>
      <td class="bold">308,00 €</td>
      <td class="color-red-700 bold">-440,46 €</td>
    </tr>
    <tr>
      <td>Gewinn/Verlust Ideeller Bereich</td>
      <td class="color-red-700 bold">-132,46 €</td>
      <td></td>
    </tr>
    <tr>
      <td><strong>Ertragsneutrale Posten</strong></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Geldzuwendungen gegen Zuwendungsbestätigung</td>
      <td>20,00 €</td>
      <td>0,00 €</td>
    </tr>
    <tr>
      <td>Geldzuwendungen ohne Zuwendungsbestätigung</td>
      <td>61,05 €</td>
      <td>0,00 €</td>
    </tr>
    <tr class="border-bottom">
      <td>Aufwandszuwendungen o. Zuwendungsbestätigung</td>
      <td>19,61 €</td>
      <td>0,00 €</td>
    </tr>
    <tr>
      <td>Saldo Ertragsneutrale Posten</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Gewinn/Verlust Ertragsneutrale Posten</td>
      <td class="bold">100,66 €</td>
      <td class="bold">0,00 €</td>
    </tr>
    <tr class="border-bottom">
      <td><strong>Zweck- und wirtschaftliche Geschäftsbetriebe</strong></td>
      <td class="bold">100,66 €</td>
      <td></td>
    </tr>
    <tr>
      <td>Saldo Zweckbetriebe</td>
      <td>0,00 €</td>
      <td>0,00 €</td>
    </tr>
    <tr>
      <td>Gewinn/Verlust Zweckbetriebe</td>
      <td>0,00 €</td>
      <td></td>
    </tr>
  </tbody>
  <tfoot>
    <tr class="bg-blue-700 color-white">
        <th scope="row" class="align-left"><strong>Gesamtsaldo</strong></th>
        <td class="align-right bold">408,66 €</td>
        <td class="align-right bold color-red-300">-440,46 €</td>
    </tr>
    <tr class="bg-blue-700 color-white">
        <th scope="row" class="align-left"><strong>Gesamt Gewinn/Verlust</strong></th>
        <td class="align-right bold color-red-300">-31,80 €</td>
        <td class="align-right"></td>
    </tr>
  </tfoot>
</table>
