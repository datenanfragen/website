{
    "title": "Guide de conception et mise en page",
    "type": "design-guide",
    "date": "2019-09-29T14:42:25+02:00",
    "last_edited": "2019-09-29T14:42:25+02:00",
    "authors": [ "baltpeter" ],
    "tags": [ "datenanfragen.de", "datarequests.org", "demandetesdonnees.fr", "guide de conception", "guide de mise en page" ]
}

Afin de rendre nos sites Web, documents, etc. cohérents et accessibles, le projet demandetesdonnees.fr a défini (et continuera à définir) un ensemble de directives de conception et de mise en page.  
Le but de cette page est de documenter et d'expliquer ces lignes directrices.

<div class="box box-warning">
Ce guide n'en est qu'à ses débuts. Ni notre charte de conception ni la documentation n'ont été finalisées. Attendez-vous à ce qu'elles changent toutes les deux à l'avenir.<br>
</div>

## Couleurs

Nous avons défini une palette de couleurs principale et une palette étendue. Combinées au noir pur et au blanc pur, ces deux palettes constituent la sélection concluante des couleurs utilisées pour demandetesdonnees.fr. Aucune autre couleur ne peut être utilisée (pas même pour les illustrations).

Pour faciliter la tâche, la palette de couleurs est disponible sous forme de [fichier Adobe Swatch Exchange (ASE)](/downloads/datenanfragen.ase) et de [bibliothèque Adobe Creative Cloud](https://shared-assets.adobe.com/link/4a911d28-c227-4821-475f-4c7efe2039d1).

### Palette principale

La palette principale se compose de notre couleur principale (bleu) et de notre couleur d'accentuation (sarcelle), chacune dans neuf nuances différentes.

#### Bleu

<table id="color-palette-blue" class="color-palette">
    <tr><td><div class="color-swatch bg-blue-100"></div></td><td>100</td><td>#e0edf8</td><td>hsb(207.5, 9.68%, 97.25%)</td><td>hsl(207.5, 63.12%, 92.54%)</td><td>cmyk(9.68, 4.44, 0, 2.75)</td></tr>
    <tr><td><div class="color-swatch bg-blue-200"></div></td><td>200</td><td>#bfd8f0</td><td>hsb(209.39, 20.42%, 94.12%)</td><td>hsl(209.39, 62.04%, 84.51%)</td><td>cmyk(20.42, 10, 0, 5.88)</td></tr>
    <tr><td><div class="color-swatch bg-blue-300"></div></td><td>300</td><td>#9cbfe5</td><td>hsb(211.23, 31.88%, 89.8%)</td><td>hsl(211.23, 58.39%, 75.49%)</td><td>cmyk(31.87, 16.59, 0, 10.2)</td></tr>
    <tr><td><div class="color-swatch bg-blue-400"></div></td><td>400</td><td>#6785c2</td><td>hsb(220.22, 46.91%, 76.08%)</td><td>hsl(220.22, 42.73%, 58.24%)</td><td>cmyk(46.91, 31.44, 0, 23.92)</td></tr>
    <tr><td><div class="color-swatch bg-blue-500"></div></td><td>500</td><td>#4a69b1</td><td>hsb(221.94, 58.19%, 69.41%)</td><td>hsl(221.94, 41.03%, 49.22%)</td><td>cmyk(58.19, 40.67, 0, 30.59)</td></tr>
    <tr><td><div class="color-swatch bg-blue-600"></div></td><td>600</td><td>#3a58a7</td><td>hsb(223.49, 65.27%, 65.49%)</td><td>hsl(223.49, 48.45%, 44.12%)</td><td>cmyk(65.27, 47.31, 0, 34.5)</td></tr>
    <tr><td><div class="color-swatch bg-blue-700"></div></td><td>700</td><td>#214192</td><td>hsb(223.01, 77.4%, 57.25%)</td><td>hsl(223.01, 63.13%, 35.09%)</td><td>cmyk(77.4, 55.48, 0, 42.76)</td></tr>
    <tr><td><div class="color-swatch bg-blue-800"></div></td><td>800</td><td>#232e62</td><td>hsb(229.52, 64.29%, 38.43%)</td><td>hsl(229.52, 47.37%, 26.08%)</td><td>cmyk(64.29, 53.06, 0, 61.57)</td></tr>
    <tr><td><div class="color-swatch bg-blue-900"></div></td><td>900</td><td>#192a4a</td><td>hsb(219.18, 66.22%, 29.02%)</td><td>hsl(219.18, 49.5%, 19.41%)</td><td>cmyk(66.22, 43.24, 0, 70.98)</td></tr>
</table>

#### Sarcelle

<table id="color-palette-teal" class="color-palette">
    <tr><td><div class="color-swatch bg-teal-100"></div></td><td>100</td><td>#e2f7ec</td><td>hsb(148.57, 8.5%, 96.86%)</td><td>hsl(148.57, 56.73%, 92.74%)</td><td>cmyk(8.5, 0, 4.45, 3.14)</td></tr>
    <tr><td><div class="color-swatch bg-teal-200"></div></td><td>200</td><td>#bfe8d8</td><td>hsb(156.59, 17.67%, 90.98%)</td><td>hsl(156.59, 47.12%, 82.94%)</td><td>cmyk(17.67, 0, 6.89, 9.02)</td></tr>
    <tr><td><div class="color-swatch bg-teal-300"></div></td><td>300</td><td>#9ee3cd</td><td>hsb(160.87, 30.4%, 89.02%)</td><td>hsl(160.87, 55.2%, 75.49%)</td><td>cmyk(30.4, 0, 9.69, 10.98)</td></tr>
    <tr><td><div class="color-swatch bg-teal-400"></div></td><td>400</td><td>#73d1b7</td><td>hsb(163.4, 44.98%, 81.96%)</td><td>hsl(163.4, 50.54%, 63.53%)</td><td>cmyk(44.98, 0, 12.44, 18.04)</td></tr>
    <tr><td><div class="color-swatch bg-teal-500"></div></td><td>500</td><td>#3bb395</td><td>hsb(165, 67.04%, 70.2%)</td><td>hsl(165, 50.42%, 46.67%)</td><td>cmyk(67.04, 0, 16.76, 29.8)</td></tr>
    <tr><td><div class="color-swatch bg-teal-600"></div></td><td>600</td><td>#199c7d</td><td>hsb(165.8, 83.97%, 61.18%)</td><td>hsl(165.8, 72.37%, 35.49%)</td><td>cmyk(83.97, 0, 19.87, 38.83)</td></tr>
    <tr><td><div class="color-swatch bg-teal-700"></div></td><td>700</td><td>#00826c</td><td>hsb(169.66, 100%, 50.98%)</td><td>hsl(169.66, 100%, 25.49%)</td><td>cmyk(100, 0, 17.23, 49.02)</td></tr>
    <tr><td><div class="color-swatch bg-teal-800"></div></td><td>800</td><td>#004d47</td><td>hsb(175.26, 100%, 30.2%)</td><td>hsl(175.26, 100%, 15.1%)</td><td>cmyk(100, 0, 7.9, 69.8)</td></tr>
    <tr><td><div class="color-swatch bg-teal-900"></div></td><td>900</td><td>#003b34</td><td>hsb(173.08, 100%, 23.14%)</td><td>hsl(173.08, 100%, 11.57%)</td><td>cmyk(100, 0, 11.53, 76.86)</td></tr>
</table>

<div id="color-palette-blue"></div>

### Palette étendue

La palette étendue est tirée du grand [Tailwind CSS](https://tailwindcss.com/docs/customizing-colors/#default-color-palette).

#### Gris

<table id="color-palette-gray" class="color-palette">
    <tr><td><div class="color-swatch bg-gray-100"></div></td><td>100</td><td>#f7fafc</td><td>hsb(204, 2.03%, 98.8%)</td><td>hsl(204, 45.52%, 97.8%)</td><td>cmyk(2.03, 0.81, 0, 1.2)</td></tr>
    <tr><td><div class="color-swatch bg-gray-200"></div></td><td>200</td><td>#edf2f7</td><td>hsb(210, 4.05%, 96.86%)</td><td>hsl(210, 38.45%, 94.9%)</td><td>cmyk(4.05, 2.02, 0, 3.14)</td></tr>
    <tr><td><div class="color-swatch bg-gray-300"></div></td><td>300</td><td>#e2e8f0</td><td>hsb(214, 5.81%, 94.13%)</td><td>hsl(214, 31.78%, 91.4%)</td><td>cmyk(5.81, 3.29, 0, 5.87)</td></tr>
    <tr><td><div class="color-swatch bg-gray-400"></div></td><td>400</td><td>#cbd5e0</td><td>hsb(211, 9.39%, 87.82%)</td><td>hsl(211, 25.29%, 83.7%)</td><td>cmyk(9.39, 4.85, 0, 12.18)</td></tr>
    <tr><td><div class="color-swatch bg-gray-500"></div></td><td>500</td><td>#a0aec0</td><td>hsb(214, 16.72%, 75.29%)</td><td>hsl(214, 20.3%, 69%)</td><td>cmyk(16.72, 9.47, 0, 24.71)</td></tr>
    <tr><td><div class="color-swatch bg-gray-600"></div></td><td>600</td><td>#718096</td><td>hsb(216, 24.67%, 58.86%)</td><td>hsl(216, 15%, 51.6%)</td><td>cmyk(24.67, 14.8, 0, 41.14)</td></tr>
    <tr><td><div class="color-swatch bg-gray-700"></div></td><td>700</td><td>#4a5568</td><td>hsb(218, 28.91%, 40.8%)</td><td>hsl(218, 16.9%, 34.9%)</td><td>cmyk(28.91, 18.31, 0, 59.2)</td></tr>
    <tr><td><div class="color-swatch bg-gray-800"></div></td><td>800</td><td>#2d3748</td><td>hsb(218, 37.53%, 28.19%)</td><td>hsl(218, 23.1%, 22.9%)</td><td>cmyk(37.53, 23.77, 0, 71.81)</td></tr>
    <tr><td><div class="color-swatch bg-gray-900"></div></td><td>900</td><td>#1a202c</td><td>hsb(220, 40.89%, 17.22%)</td><td>hsl(220, 25.7%, 13.7%)</td><td>cmyk(40.89, 27.26, 0, 82.78)</td></tr>
</table>

#### Rouge

<table id="color-palette-red" class="color-palette">
    <tr><td><div class="color-swatch bg-red-100"></div></td><td>100</td><td>#fff5f5</td><td>hsb(0, 4%, 100%)</td><td>hsl(0, 100%, 98%)</td><td>cmyk(0, 4, 4, 0)</td></tr>
    <tr><td><div class="color-swatch bg-red-200"></div></td><td>200</td><td>#fed7d7</td><td>hsb(0, 15.28%, 99.61%)</td><td>hsl(0, 95.13%, 92%)</td><td>cmyk(0, 15.28, 15.28, 0.39)</td></tr>
    <tr><td><div class="color-swatch bg-red-300"></div></td><td>300</td><td>#feb2b2</td><td>hsb(0, 29.92%, 99.6%)</td><td>hsl(0, 97.39%, 84.7%)</td><td>cmyk(0, 29.92, 29.92, 0.4)</td></tr>
    <tr><td><div class="color-swatch bg-red-400"></div></td><td>400</td><td>#fc8181</td><td>hsb(0, 48.8%, 98.81%)</td><td>hsl(0, 95.3%, 74.7%)</td><td>cmyk(0, 48.8, 48.8, 1.19)</td></tr>
    <tr><td><div class="color-swatch bg-red-500"></div></td><td>500</td><td>#f56565</td><td>hsb(0, 58.86%, 96.07%)</td><td>hsl(0, 87.8%, 67.8%)</td><td>cmyk(0, 58.86, 58.86, 3.93)</td></tr>
    <tr><td><div class="color-swatch bg-red-600"></div></td><td>600</td><td>#e53e3e</td><td>hsb(0, 72.87%, 89.83%)</td><td>hsl(0, 76.29%, 57.1%)</td><td>cmyk(0, 72.87, 72.87, 10.17)</td></tr>
    <tr><td><div class="color-swatch bg-red-700"></div></td><td>700</td><td>#c53030</td><td>hsb(0, 75.62%, 77.18%)</td><td>hsl(0, 60.8%, 48%)</td><td>cmyk(0, 75.62, 75.62, 22.82)</td></tr>
    <tr><td><div class="color-swatch bg-red-800"></div></td><td>800</td><td>#9b2c2c</td><td>hsb(0, 71.63%, 60.76%)</td><td>hsl(0, 55.8%, 39%)</td><td>cmyk(0, 71.63, 71.63, 39.24)</td></tr>
    <tr><td><div class="color-swatch bg-red-900"></div></td><td>900</td><td>#742a2a</td><td>hsb(0, 63.76%, 45.51%)</td><td>hsl(0, 46.8%, 31%)</td><td>cmyk(0, 63.76, 63.76, 54.49)</td></tr>
</table>

#### Orange

<table id="color-palette-orange" class="color-palette">
    <tr><td><div class="color-swatch bg-orange-100"></div></td><td>100</td><td>#fffaf0</td><td>hsb(40, 5.8%, 100%)</td><td>hsl(40, 100%, 97.1%)</td><td>cmyk(0, 1.93, 5.8, 0)</td></tr>
    <tr><td><div class="color-swatch bg-orange-200"></div></td><td>200</td><td>#feebc8</td><td>hsb(39, 21.29%, 99.6%)</td><td>hsl(39, 96.36%, 89%)</td><td>cmyk(0, 7.45, 21.28, 0.4)</td></tr>
    <tr><td><div class="color-swatch bg-orange-300"></div></td><td>300</td><td>#fbd38d</td><td>hsb(38, 43.75%, 98.43%)</td><td>hsl(38, 93.2%, 76.9%)</td><td>cmyk(0, 16.04, 43.75, 1.57)</td></tr>
    <tr><td><div class="color-swatch bg-orange-400"></div></td><td>400</td><td>#f6ae55</td><td>hsb(33, 65.43%, 96.45%)</td><td>hsl(33, 89.89%, 64.9%)</td><td>cmyk(0, 29.44, 65.42, 3.55)</td></tr>
    <tr><td><div class="color-swatch bg-orange-500"></div></td><td>500</td><td>#ed8836</td><td>hsb(27, 77.16%, 92.96%)</td><td>hsl(27, 83.59%, 57.1%)</td><td>cmyk(0, 42.43, 77.15, 7.04)</td></tr>
    <tr><td><div class="color-swatch bg-orange-600"></div></td><td>600</td><td>#dd6c20</td><td>hsb(24, 85.52%, 86.65%)</td><td>hsl(24, 74.7%, 49.6%)</td><td>cmyk(0, 51.31, 85.52, 13.35)</td></tr>
    <tr><td><div class="color-swatch bg-orange-700"></div></td><td>700</td><td>#c05621</td><td>hsb(20, 82.84%, 75.28%)</td><td>hsl(20, 70.71%, 44.1%)</td><td>cmyk(0, 55.23, 82.84, 24.72)</td></tr>
    <tr><td><div class="color-swatch bg-orange-800"></div></td><td>800</td><td>#9c4221</td><td>hsb(16, 78.86%, 61.25%)</td><td>hsl(16, 65.1%, 37.1%)</td><td>cmyk(0, 57.83, 78.86, 38.75)</td></tr>
    <tr><td><div class="color-swatch bg-orange-900"></div></td><td>900</td><td>#7b341e</td><td>hsb(14, 75.62%, 48.24%)</td><td>hsl(14, 60.8%, 30%)</td><td>cmyk(0, 57.98, 75.62, 51.76)</td></tr>
</table>

#### Jaune

<table id="color-palette-yellow" class="color-palette">
    <tr><td><div class="color-swatch bg-yellow-100"></div></td><td>100</td><td>#fffff0</td><td>hsb(60, 5.8%, 100%)</td><td>hsl(60, 100%, 97.1%)</td><td>cmyk(0, 0, 5.8, 0)</td></tr>
    <tr><td><div class="color-swatch bg-yellow-200"></div></td><td>200</td><td>#fefcbf</td><td>hsb(58, 24.71%, 99.61%)</td><td>hsl(58, 96.93%, 87.3%)</td><td>cmyk(0, 0.82, 24.72, 0.39)</td></tr>
    <tr><td><div class="color-swatch bg-yellow-300"></div></td><td>300</td><td>#faf189</td><td>hsb(55, 45.18%, 98.05%)</td><td>hsl(55, 91.91%, 75.9%)</td><td>cmyk(0, 3.77, 45.18, 1.95)</td></tr>
    <tr><td><div class="color-swatch bg-yellow-400"></div></td><td>400</td><td>#f6df5e</td><td>hsb(51, 61.72%, 96.47%)</td><td>hsl(51, 89.4%, 66.7%)</td><td>cmyk(0, 9.26, 61.72, 3.53)</td></tr>
    <tr><td><div class="color-swatch bg-yellow-500"></div></td><td>500</td><td>#ecc94b</td><td>hsb(47, 68.18%, 92.55%)</td><td>hsl(47, 80.9%, 61%)</td><td>cmyk(0, 14.77, 68.18, 7.45)</td></tr>
    <tr><td><div class="color-swatch bg-yellow-600"></div></td><td>600</td><td>#d69e2e</td><td>hsb(40, 78.47%, 83.93%)</td><td>hsl(40, 67.2%, 51%)</td><td>cmyk(0, 26.16, 78.47, 16.07)</td></tr>
    <tr><td><div class="color-swatch bg-yellow-700"></div></td><td>700</td><td>#b77a1f</td><td>hsb(36, 83.04%, 71.82%)</td><td>hsl(36, 71%, 42%)</td><td>cmyk(0, 33.22, 83.04, 28.18)</td></tr>
    <tr><td><div class="color-swatch bg-yellow-800"></div></td><td>800</td><td>#975b16</td><td>hsb(32, 85.45%, 59.19%)</td><td>hsl(32, 74.6%, 33.9%)</td><td>cmyk(0, 39.88, 85.45, 40.81)</td></tr>
    <tr><td><div class="color-swatch bg-yellow-900"></div></td><td>900</td><td>#744210</td><td>hsb(30, 86.23%, 45.53%)</td><td>hsl(30, 75.79%, 25.9%)</td><td>cmyk(0, 43.11, 86.23, 54.47)</td></tr>
</table>

#### Vert

<table id="color-palette-green" class="color-palette">
    <tr><td><div class="color-swatch bg-green-100"></div></td><td>100</td><td>#f0fff4</td><td>hsb(136, 5.8%, 100%)</td><td>hsl(136, 100%, 97.1%)</td><td>cmyk(5.8, 0, 4.25, 0)</td></tr>
    <tr><td><div class="color-swatch bg-green-200"></div></td><td>200</td><td>#c6f6d5</td><td>hsb(139, 19.44%, 96.48%)</td><td>hsl(139, 72.71%, 87.1%)</td><td>cmyk(19.44, 0, 13.29, 3.52)</td></tr>
    <tr><td><div class="color-swatch bg-green-300"></div></td><td>300</td><td>#9ae6b5</td><td>hsb(141, 33.03%, 90.19%)</td><td>hsl(141, 60.29%, 75.3%)</td><td>cmyk(33.02, 0, 21.46, 9.81)</td></tr>
    <tr><td><div class="color-swatch bg-green-400"></div></td><td>400</td><td>#68d391</td><td>hsb(143, 50.67%, 82.77%)</td><td>hsl(143, 54.9%, 61.8%)</td><td>cmyk(50.67, 0, 31.25, 17.23)</td></tr>
    <tr><td><div class="color-swatch bg-green-500"></div></td><td>500</td><td>#48bb78</td><td>hsb(145, 61.46%, 73.33%)</td><td>hsl(145, 45.8%, 50.8%)</td><td>cmyk(61.46, 0, 35.85, 26.67)</td></tr>
    <tr><td><div class="color-swatch bg-green-600"></div></td><td>600</td><td>#38a169</td><td>hsb(148, 65.23%, 63.07%)</td><td>hsl(148, 48.4%, 42.5%)</td><td>cmyk(65.23, 0, 34.79, 36.93)</td></tr>
    <tr><td><div class="color-swatch bg-green-700"></div></td><td>700</td><td>#2f855a</td><td>hsb(150, 64.68%, 52.17%)</td><td>hsl(150, 47.8%, 35.3%)</td><td>cmyk(64.68, 0, 32.34, 47.83)</td></tr>
    <tr><td><div class="color-swatch bg-green-800"></div></td><td>800</td><td>#276749</td><td>hsb(152, 62.16%, 40.34%)</td><td>hsl(152, 45.1%, 27.8%)</td><td>cmyk(62.16, 0, 29.01, 59.66)</td></tr>
    <tr><td><div class="color-swatch bg-green-900"></div></td><td>900</td><td>#22543d</td><td>hsb(152, 59.55%, 32.89%)</td><td>hsl(152, 42.4%, 23.1%)</td><td>cmyk(59.55, 0, 27.79, 67.11)</td></tr>
</table>

#### Rose

<table id="color-palette-pink" class="color-palette">
    <tr><td><div class="color-swatch bg-pink-100"></div></td><td>100</td><td>#fff5f7</td><td>hsb(348, 4%, 100%)</td><td>hsl(348, 100%, 98%)</td><td>cmyk(0, 4, 3.2, 0)</td></tr>
    <tr><td><div class="color-swatch bg-pink-200"></div></td><td>200</td><td>#fed7e2</td><td>hsb(343, 15.28%, 99.61%)</td><td>hsl(343, 95.13%, 92%)</td><td>cmyk(0, 15.28, 10.95, 0.39)</td></tr>
    <tr><td><div class="color-swatch bg-pink-300"></div></td><td>300</td><td>#fbb6ce</td><td>hsb(339, 27.49%, 98.43%)</td><td>hsl(339, 89.6%, 84.9%)</td><td>cmyk(0, 27.49, 17.87, 1.57)</td></tr>
    <tr><td><div class="color-swatch bg-pink-400"></div></td><td>400</td><td>#f687b3</td><td>hsb(336, 45.11%, 96.46%)</td><td>hsl(336, 86.01%, 74.7%)</td><td>cmyk(0, 45.12, 27.07, 3.54)</td></tr>
    <tr><td><div class="color-swatch bg-pink-500"></div></td><td>500</td><td>#ed64a6</td><td>hsb(331, 57.77%, 92.95%)</td><td>hsl(331, 79.2%, 66.1%)</td><td>cmyk(0, 57.77, 29.85, 7.05)</td></tr>
    <tr><td><div class="color-swatch bg-pink-600"></div></td><td>600</td><td>#d53f8c</td><td>hsb(329, 70.45%, 83.52%)</td><td>hsl(329, 64.1%, 54.1%)</td><td>cmyk(0, 70.45, 34.05, 16.48)</td></tr>
    <tr><td><div class="color-swatch bg-pink-700"></div></td><td>700</td><td>#b83280</td><td>hsb(325, 72.85%, 72.2%)</td><td>hsl(325, 57.29%, 45.9%)</td><td>cmyk(0, 72.85, 30.35, 27.8)</td></tr>
    <tr><td><div class="color-swatch bg-pink-800"></div></td><td>800</td><td>#97266e</td><td>hsb(322, 74.84%, 59.29%)</td><td>hsl(322, 59.8%, 37.1%)</td><td>cmyk(0, 74.84, 27.44, 40.71)</td></tr>
    <tr><td><div class="color-swatch bg-pink-900"></div></td><td>900</td><td>#702459</td><td>hsb(318, 67.9%, 43.91%)</td><td>hsl(318, 51.4%, 29%)</td><td>cmyk(0, 67.9, 20.37, 56.09)</td></tr>
</table>

### Noir et blanc

<table id="color-palette-bw" class="color-palette">
    <tr><td><div class="color-swatch bg-black"></div></td><td>&nbsp;&nbsp;&nbsp;</td><td>#000000</td><td>hsb(0, 0%, 0%)</td><td>hsl(0, 0%, 0%)</td><td>cmyk(100, 100, 100, 100)</td></tr>
    <tr><td><div class="color-swatch bg-white"></div></td><td>&nbsp;&nbsp;&nbsp;</td><td>#ffffff</td><td>hsb(0, 0%, 100%)</td><td>hsl(0, 0%, 100%)</td><td>cmyk(0, 0, 0, 0)</td></tr>
</table>

<style>
table.color-palette {
    width: 100%;
    margin: 15px 0 50px 0;
}
table.color-palette tr td:nth-child(1) {
    padding: 3px 5px 3px 0;
}
table.color-palette tr td:nth-child(2) {
    font-weight: bold;
}

.color-swatch {
    width: 50px;
    height: 50px;

    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05) !important;
    border-radius: 2px;
}
</style>
