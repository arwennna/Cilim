var prvi, drugi, treci;

function prikazi(e) {
	if (e == 'novaIgra') {
		prvi = document.getElementById("novaIgraSadrzaj");
		drugi = document.getElementById("uputeSadrzaj");
		treci = document.getElementById("aboutSadrzaj");
		console.log(e);
	}
	else if (e == 'upute') {
		prvi = document.getElementById("uputeSadrzaj");
		drugi = document.getElementById("novaIgraSadrzaj");
		treci = document.getElementById("aboutSadrzaj");
		console.log(e);
	}
	else if (e == 'about') {
		prvi = document.getElementById("aboutSadrzaj");
		drugi = document.getElementById("novaIgraSadrzaj");
		treci = document.getElementById("uputeSadrzaj");
		console.log(e);
	}
	if (prvi.style.display == "none") {
	    prvi.style.display = "block";
	    drugi.style.display = "none";
	    treci.style.display = "none";
	  } else {
	    prvi.style.display = "none";
	  }
}

function pokupiPodatke() {
	var igrac1 = document.getElementById("igrac1").value;
	var igrac2 = document.getElementById("igrac2").value;
	// https://www.tutorialspoint.com/jqueryexamples/attr_radio.htm //
	var level = $('input[name="opcije"]:checked').val();

	localStorage.setItem("igrac1", igrac1);
	localStorage.setItem("igrac2", igrac2);
	localStorage.setItem("level", level);
}