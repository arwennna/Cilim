//----------------------------------------------------------------------------------VARIJABLE------------------------------------------------------------------------------------//

//Boje
const siva = '#d6d6d6';
const plava = '#56767d';
const crvena = '#661111';

//Podatke koje smo dobili kroz formu čuvamo u local storage
var igrac1 = localStorage.getItem("igrac1");
var igrac2 = localStorage.getItem("igrac2");
var level = localStorage.getItem("level");

//Varijable vezane za id ploče, broj polja, dimenziju, itd.
var canvas = document.getElementById("ploca");
canvas.height = 50*level;
canvas.width = 50*level;
var ctx = canvas.getContext("2d");
var pola = parseInt(Math.floor(level/2));
var zbir = parseInt(pola) + parseInt(level);
var ukupno;

//Varijable za centriranje ćilima	
//getBoundingClientRect() vraća objekat sa informacijama o veličini elementa i njegovoj relativnoj poziciji u odnosu na viewport
var bb = document.querySelector ('#kolonaPloca').getBoundingClientRect();
var unit = bb.right - bb.left;
var margina = parseInt((unit - canvas.width)/2);

//Score počinjemo brojati od 2 jer smo svakom od igrača na početku dodijelili po dva polja
var score1;
var score2;  

var trenutniIgrac; //1 - prvi igrač, 2 - drugi igrač

var boja1 = crvena; //prvi igrač
var boja2 = plava; //drugi igrač

var trenutnaBoja;

var matrica;

//-----------------------------------------------------------------------------------FUNKCIJE------------------------------------------------------------------------------------//

//Nova igra započinje pri otvaranju prozora
window.onload = function() {
	start();
};

////Inicijalizacija nove igre
function start() {

	//Postavljanje početnih parametara
	var pobjednik = document.getElementById('winner');
	pobjednik.style.visibility = 'hidden';
	document.getElementById('revans').style.visibility = 'hidden';
	document.getElementById('pocetna').style.visibility = 'hidden';
	document.getElementById('prviIgrac').style.color = crvena;
	document.getElementById('drugiIgrac').style.color = 'black';
	score1 = 2;
	score2 = 2;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	trenutniIgrac = 1;
	trenutnaBoja = boja1;

	document.getElementById('ime1').innerText = igrac1;
	document.getElementById('ime2').innerText = igrac2;

	canvas.style.marginRight = margina+'px';
	canvas.style.marginLeft = margina+'px';

	ukupno = getUkupno(level);

	updateujPrvi();
	updateujDrugi();

	//Pravimo matricu, a zatim iscrtavamo ploču te u matricu upisujemo odgovarajuće vrijednosti
	matrica = [];
	napraviMatricu(level);

	popuni();
}

//Event listener koji detektuje i igra validne poteze, glavna funkcija
canvas.addEventListener('click', function (e) {

	var x = Math.floor(e.offsetX / 50);
	var y = Math.floor(e.offsetY / 50);

	if (matrica[y][x].gore != -1 && matrica[y][x].ukupno != 4) {

		//Varijable koje određuju poziciju klika unutar kvadratića
		var xk = e.offsetX % 50;
		var yk = 50 - (e.offsetY % 50);

		var potencijalni = '';
		var okruzen = true;
		var biloPoteza = false;

		//Za svaki kliknuti kvadratić, osim njega, moramo provjeriti i odgovarajući susjedni (jer susjedni kvadratići imaju po jednu zajedničku ivicu)

		ctx.beginPath();
		ctx.lineWidth = 1.0;
		ctx.strokeStyle = trenutnaBoja;

		if (xk <= yk && xk + yk >= 50) { //Gornja ivica u kliknutom kvadratiću (potencijalno donja onog iznad)
			if (matrica[y][x].gore != 1 && matrica[y-1][x].dolje != 1) {
				ctx.moveTo(x*50, y*50);
				ctx.lineTo(x*50+50, y*50);
				ctx.stroke();
				matrica[y][x].gore = 1;
				matrica[y-1][x].dolje = 1;
				matrica[y][x].ukupno += 1;
				matrica[y-1][x].ukupno += 1;
				potencijalni = 'dolje';
				biloPoteza = true;
			}
		} else if (xk >= yk && xk + yk >= 50) { //Desna ivica u kliknutom kvadratiću (potencijalno lijeva onog desno)
			if (matrica[y][x].desno != 1 && matrica[y][x+1].lijevo != 1) {
				ctx.moveTo(x*50+50, y*50);
				ctx.lineTo(x*50+50, y*50+50);
				ctx.stroke();
				matrica[y][x].desno = 1;
				matrica[y][x+1].lijevo = 1;
				matrica[y][x].ukupno += 1;
				matrica[y][x+1].ukupno += 1;
				potencijalni = 'lijevo';
				biloPoteza = true;
			}
		} else if (xk >= yk && xk + yk <= 50) { //Donja ivica u kliknutom kvadratiću (potencijalno gornja onog ispod)
			if (matrica[y][x].dolje != 1 && matrica[y+1][x].gore != 1) {
				ctx.moveTo(x*50+50, y*50+50);
				ctx.lineTo(x*50, y*50+50);
				ctx.stroke();
				matrica[y][x].dolje = 1;
				matrica[y+1][x].gore = 1;
				matrica[y][x].ukupno += 1;
				matrica[y+1][x].ukupno += 1;
				potencijalni = 'gore';
				biloPoteza = true;
			}
		} else if (xk <= yk && xk + yk <= 50 ){ //Lijeva ivica u kliknutom kvadratiću (potencijalno desna onog lijevo)
			if (matrica[y][x].lijevo != 1 && matrica[y][x-1].desno != 1) {
				ctx.moveTo(x*50, y*50);
				ctx.lineTo(x*50, y*50+50);
				ctx.stroke();
				matrica[y][x].lijevo = 1;
				matrica[y][x-1].desno = 1;
				matrica[y][x].ukupno += 1;
				matrica[y][x-1].ukupno += 1;
				potencijalni = 'desno';
				biloPoteza = true;
			}
		}

		if (biloPoteza) {
			//Ako smo obojili kvadrat unutar kojeg je kliknuto:
			if (matrica[y][x].ukupno == 4) {
				zavrsiPotezUspjeh(x, y);
			} else {
				okruzen = false;
			}

			switch(potencijalni) {
				case 'dolje':
					y -= parseInt(1);
					break;
				case 'desno':
					x -= parseInt(1);
					break;
				case 'gore':
					y += parseInt(1);
					break;
				case 'lijevo':
					x += parseInt(1);
					break;
			}

			//Ako smo obojili susjedni kvadrat:
			if (matrica[y][x].ukupno == 4) {
				zavrsiPotezUspjeh(x, y);
			} else { //Nismo obojili ni kliknuti ni susjedni, pa moramo zamijeniti aktuelnog igrača:
					if (!okruzen) {
						if (trenutniIgrac == 1) {
			    			trenutniIgrac = 2;
			    			trenutnaBoja = boja2;
			    			document.getElementById('prviIgrac').style.color = 'black';
			    			document.getElementById('drugiIgrac').style.color = plava;

			    		}
			 			else if (trenutniIgrac == 2) {
			    			trenutniIgrac = 1;
			    			trenutnaBoja = boja1;
			    			document.getElementById('prviIgrac').style.color = crvena;
			    			document.getElementById('drugiIgrac').style.color = 'black';
			   		 }	

				}
			}
		}
	}
} );


//Funkcija koja vraća ukupni broj polja koja trebaju biti popunjena u zavisnosti od levela
function getUkupno(n) {
	suma = 0;
	for (let i=0; i<Math.floor(level/2); i++) {
		suma += parseInt(2*(2*(i)+1));
	}
	suma += parseInt(level);
	return suma;
}

//Konstruktor za objekte tipa polje, u kojima čuvamo podatke o postojećim ivicama, vrijednosti -1 označavaju da polje nije validno
function polje() {
	this.gore = -1;
	this.desno = -1;
	this.dolje = -1;
	this.lijevo = -1;
	this.ukupno = 0
}

//Inicijaliziramo matricu polja
function napraviMatricu(n) {
	for (let i=0; i<n; i++) {
		matrica.push([]);
		for (let j=0; j<n; j++) {
			matrica[i].push(new polje());
		}
	}
}

//Funkcija koja popunjava ploču i matricu odgovarajućim vrijednostima
function popuni() {
	for (let i=0; i<level; i++) {

		for (let j=0; j<=pola; j++) {
			
			//Iscrtava gornji (prolazi kroz lijevi)

			if((i<=pola && i+j>=pola) || (i>=pola && i-j<=pola)) {
				ctx.fillStyle = 'white';
				ctx.fillRect(i*50, j*50, 50, 50);
				ctx.beginPath();
				ctx.lineWidth = 1.0;
				ctx.strokeStyle = siva;
				ctx.rect(i * 50, j * 50, 50, 50);
				ctx.stroke();
				matrica[j][i].gore = 0;
				matrica[j][i].desno = 0;
				matrica[j][i].dolje = 0;
				matrica[j][i].lijevo = 0;
			}

			ctx.strokeStyle = 'black';

			if(i<pola && i+j==pola) {
				ctx.beginPath();
				ctx.lineWidth = 2.0;
				ctx.moveTo(i*50+50, j*50);
				ctx.lineTo(i*50, j*50);
				ctx.lineTo(i*50, j*50+50);	
				ctx.stroke();
				matrica[j][i].gore = 1;
				matrica[j][i].lijevo = 1;
				matrica[j][i].ukupno = 2;
			}

			if(i>pola && i-j==pola) {
				ctx.beginPath();
				ctx.lineWidth = 2.0;
				ctx.moveTo(i*50, j*50);
				ctx.lineTo(i*50+50, j*50);
				ctx.lineTo(i*50+50, j*50+50);
				ctx.stroke();
				matrica[j][i].gore = 1;
				matrica[j][i].desno = 1;
				matrica[j][i].ukupno = 2;
			}

			if(i==pola && j==0) {
				ctx.fillStyle = plava;
				ctx.fillRect(i*50, j*50, 50, 50);
				ctx.beginPath();
				ctx.moveTo(i*50, j*50+50);
				ctx.lineTo(i*50, j*50);
				ctx.lineWidth = 2.0;
				ctx.stroke();
				ctx.beginPath();
				ctx.lineWidth = 4.0;
				ctx.moveTo(i*50, j*50);
				ctx.lineTo(i*50+50, j*50);
				ctx.stroke();
				ctx.beginPath();
				ctx.lineWidth = 2.0;
				ctx.moveTo(i*50+50, j*50);
				ctx.lineTo(i*50+50, j*50+50);
				ctx.stroke();
				matrica[j][i].gore = 1;
				matrica[j][i].desno = 1;
				matrica[j][i].lijevo = 1;
				matrica[j][i].dolje = 1;
				matrica[j][i].dolje = 1;
				matrica[j][i].ukupno = 4;

				matrica[j+1][i].gore = 1;
				matrica[j+1][i].ukupno = 1;
			}

			if(j==pola) {

				if (i==0) {
					ctx.fillStyle = plava;
					ctx.fillRect(i*50, j*50, 50, 50);
					ctx.beginPath();
					ctx.lineWidth = 2.0;
					ctx.moveTo(i*50+50, j*50+50);
					ctx.lineTo(i*50, j*50+50);
					ctx.lineTo(i*50, j*50);
					ctx.stroke();
					matrica[j][i].dolje = 1;
					matrica[j][i].desno = 1;
					matrica[j][i].ukupno = 4;

					matrica[j][i+1].desno = 1;
					matrica[j][i+1].ukupno = 1;
				}

				if (i==level-1) {
					ctx.fillStyle = crvena;
					ctx.fillRect(i*50, j*50, 50, 50);
					ctx.beginPath();
					ctx.lineWidth = 2.0;
					ctx.moveTo(i*50, j*50+50);
					ctx.moveTo(i*50, j*50+50);
					ctx.lineTo(i*50+50, j*50+50);
					ctx.lineTo(i*50+50, j*50);
					ctx.stroke();
					matrica[j][i].dolje = 1;
					matrica[j][i].lijevo = 1;
					matrica[j][i].ukupno = 4;

					matrica[j][i-1].desno = 1;
					matrica[j][i-1].ukupno = 1;
				}
			}

		}
		for (let j=pola+1; j<level; j++) {

			//Iscrtava donji (prolazi kroz desni)

			if((i<=pola && j-i<=pola) || (i>=pola && i+j<zbir)) {
				ctx.fillStyle = 'white';
				ctx.fillRect(i*50, j*50, 50, 50);
				ctx.beginPath();
				ctx.lineWidth = 1.0;
				ctx.strokeStyle = siva;
				ctx.rect(i * 50, j * 50, 50, 50);
				ctx.stroke();
				matrica[j][i].gore = 0;
				matrica[j][i].desno = 0;
				matrica[j][i].dolje = 0;
				matrica[j][i].lijevo = 0;
			}

			ctx.strokeStyle = 'black';

			if(i<pola && j-i==pola) {
				ctx.beginPath();
				ctx.lineWidth = 2.0;
				ctx.moveTo(i*50, j*50);
				ctx.lineTo(i*50, j*50+50);
				ctx.lineTo(i*50+50, j*50+50);
				ctx.stroke();
				matrica[j][i].dolje = 1;
				matrica[j][i].lijevo = 1;
				matrica[j][i].ukupno = 2;
			}

			if(i>pola && i+j+1==zbir) {
				ctx.beginPath();
				ctx.lineWidth = 2.0;
				ctx.moveTo(i*50+50, j*50);
				ctx.lineTo(i*50+50, j*50+50);
				ctx.lineTo(i*50, j*50+50);
				ctx.stroke();
				matrica[j][i].dolje = 1;
				matrica[j][i].desno = 1;
				matrica[j][i].ukupno = 2;
			}

			if(i==pola && j==level-1) {
				ctx.fillStyle = crvena;
				ctx.fillRect(i*50, j*50, 50, 50);
				ctx.beginPath();
				ctx.lineWidth = 2.0;
				ctx.moveTo(i*50, j*50);
				ctx.lineTo(i*50, j*50+50);
				ctx.stroke();
				ctx.beginPath();
				ctx.lineWidth = 4.0;
				ctx.moveTo(i*50, j*50+50);
				ctx.lineTo(i*50+50, j*50+50);
				ctx.stroke();
				ctx.beginPath();
				ctx.lineWidth = 2.0;
				ctx.moveTo(i*50+50, j*50+50);
				ctx.lineTo(i*50+50, j*50);
				ctx.stroke();
				matrica[j][i].gore = 1;
				matrica[j][i].lijevo = 1;
				matrica[j][i].desno = 1;
				matrica[j][i].dolje = 1;
				matrica[j][i].ukupno = 4;

				matrica[j-1][i].dolje = 1;
				matrica[j-1][i].ukupno = 1;
			}
		}
	}
}


//Update trenutnih rezultata
function updateujPrvi() {
	var rezultat1 = document.getElementById('rezultat1');
	rezultat1.innerText = score1;
}

function updateujDrugi() {
	var rezultat2 = document.getElementById('rezultat2');
	rezultat2.innerText = score2;
}

//Ako je potezom zatvoren kvadratić potrebno je popuniti ga odgovarajućom bojom i ispisati rezultat. Ako je potezom završila igra određujemo pobjednika.
function zavrsiPotezUspjeh(x, y) {
	ctx.fillStyle = trenutnaBoja;
	ctx.fillRect(x*50, y*50, 50, 50);
	if (trenutniIgrac == 1) {
		score1 += 1;
		updateujPrvi();
	}
	else if (trenutniIgrac == 2) {
		score2 += 1;
		updateujDrugi();
	}
	if (score1 + score2 == parseInt(ukupno)) {
		var str;
		if (parseInt(score1) > parseInt(score2))
			str = igrac1;
		else if (parseInt(score1) < parseInt(score2))
			str = igrac2;
		ispisi(str);
	}
}

//Funkcija za prikazivanje informacija o pobjedniku, te mogućnost revanša ili povratka na početnu
function ispisi(s) {
	var pobjednik = document.getElementById('winner');
	pobjednik.innerText = 'Pobjednik je ' + s;
	pobjednik.style.visibility = 'visible'; 
	document.getElementById('revans').style.visibility = 'visible';
	document.getElementById('pocetna').style.visibility = 'visible';
}