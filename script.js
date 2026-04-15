const citiesByDestination = {
    france:  ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux', 'Strasbourg', 'Nantes'],
    japon:    ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka'],
    usa:      ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'Las Vegas', 'Washington D.C.'],
    espagne:  ['Madrid', 'Barcelone', 'Séville', 'Valence', 'Bilbao', 'Malaga'],
    italie:   ['Rome', 'Milan', 'Venise', 'Florence', 'Naples', 'Turin']
};

const destSelect= document.getElementById("destination");
const citySelect= document.getElementById("ville");


destSelect.addEventListener('change', function(){
    const selectedDest= this.value;
    citySelect.innerHTML= ''

    if(selectedDest && citiesByDestination[selectedDest]){
        citySelect.disabled=false;

        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = '-- Choisir une ville --';
        citySelect.appendChild(defaultOpt); 

        citiesByDestination[selectedDest].forEach(city => {
            const opt= document.createElement('option');
            opt.value= city.toLowerCase().replace(/\s+/g, '-');
            opt.textContent= city;
            citySelect.appendChild(opt);
        });   
    }
    else {
        // ❌ Disable again if user selects the placeholder
        citySelect.disabled = true;
        citySelect.innerHTML = '<option value="">-- D\'abord choisir une destination --</option>';
    }
});

// === LOGIQUE D'EXCLUSION : SANS & TOUS RISQUES ===
const sans = document.getElementById('ass_sans');
const med = document.getElementById('ass_medical');
const medRep = document.getElementById('ass_medrep');
const vol = document.getElementById('ass_vol');
const tous = document.getElementById('ass_tous');

const allAssurances = document.querySelectorAll('input[name="assurance[]"]');
const verif= document.querySelectorAll('.verif');
const medic= document.querySelectorAll('.medic');
const paragraph_dec= document.getElementById('ass_p');

function decocher(caseCoche){
    allAssurances.forEach(option => {
        if(option !== caseCoche){
            option.checked= false;
            option.disabled=true;
        }
    })
}

function activer(){
    allAssurances.forEach(option => {
        option.disabled= false;
    })
}

sans.addEventListener("change", function(){
    if(this.checked){
        decocher(this);
        paragraph_dec.textContent="vous ne pouvez pas choisir sans et une autre assurance ";
        paragraph_dec.style.color="blue";
    }
    else{
        activer();
        paragraph_dec.textContent="";
    }
});

tous.addEventListener("change", function(){
    if(this.checked){
        decocher(this);
        paragraph_dec.textContent="vous ne pouvez pas choisir Tous Risques et une autre assurance ";
        paragraph_dec.style.color="blue";
    }
    else{
        activer();
        paragraph_dec.textContent="";
    }
});

verif.forEach( option => {
    option.addEventListener("change", function(){
        sans.checked= false;
        tous.checked= false;
    })
});

med.addEventListener('change', function(){
            if(this.checked){
                medRep.disabled=true;
                sans.disabled=true;
                tous.disabled=true;
                paragraph_dec.textContent="vous pouvez choisir soit medicale, soit medicale + Repartriement, pas les deux";
                paragraph_dec.style.color="blue";
            }else{
                if(vol.checked){
                    sans.disabled=true;
                    tous.disabled=true;
                    medRep.disabled=false;
                    paragraph_dec.textContent="vouz ne pouvez choisir ni Tous Risques, ni sans";
                }
                else{
                     medRep.disabled=false;
                    sans.disabled=false;
                    tous.disabled=false;
                    paragraph_dec.textContent="";
                }
            }
        })

medRep.addEventListener('change', function(){
            if(this.checked){
                med.disabled=true;
                sans.disabled=true;
                tous.disabled=true;
                paragraph_dec.textContent="vous pouvez choisir soit medicale, soit medicale + Repartriement, pas les deux";
                paragraph_dec.style.color="blue";
            }else{
                if(vol.checked){
                    sans.disabled=true;
                    tous.disabled=true;
                    med.disabled=false;
                    paragraph_dec.textContent="vouz ne pouvez choisir ni Tous Risques, ni sans";
                }
                else{
                     med.disabled=false;
                    sans.disabled=false;
                    tous.disabled=false;
                    paragraph_dec.textContent="";
                }
            }
        })

vol.addEventListener('change', function(){
        paragraph_dec.textContent="vouz ne pouvez pas choisir ni Tous Risques, ni sans";
        paragraph_dec.style.color="blue";
            if(this.checked){
                sans.disabled=true;
                tous.disabled=true;
            }else{
                if(med.checked || medRep.checked){
                    sans.disabled=true;
                    tous.disabled=true;
                    paragraph_dec.textContent="vous pouvez choisir soit medicale, soit medicale + Repartriement, pas les deux";
                    paragraph_dec.style.color="blue"
                }
                else{
                    sans.disabled=false;
                    tous.disabled=false;
                }
            }
})

const paiements= document.querySelectorAll('input[name="paiement"]');
const code= document.getElementById('code_securite');
const paragraph= document.getElementById('code_p');

paiements.forEach( paiement => {
    paiement.addEventListener('change', function(){
        if(this.value === 'virement'){
            code.disabled=true;
            code.style.cursor="not-allowed";
            paragraph.textContent="pas besoin de code";
            paragraph.style.color="blue";
        }
        else{
            paragraph.textContent="";
            code.style.cursor="pointer";
            code.disabled=false
            code.placeholder= "••••"
            code.maxLentgh= 4;
        }
    });
});

// === 4. RÉCAPITULATIF DYNAMIQUE ===
const form = document.getElementById('voyageForm') || document.querySelector('form');
const btnInfo = document.getElementById('btn-info');
const infoPanel = document.getElementById('info-panel');
const infoContent = document.getElementById('info-content');
const closeInfoBtn = document.getElementById('close-info');

// Fonction pour formater et afficher le récapitulatif
function afficherRecap() {
    const data = new FormData(form);
    
    // Helper : récupérer une valeur ou une valeur par défaut
    const val = (name, def = 'Non renseigné') => data.get(name) || def;
    
    // Textes lisibles pour les selects
    const destSelect = document.getElementById('destination');
    const villeSelect = document.getElementById('ville');
    const destText = destSelect.value ? destSelect.options[destSelect.selectedIndex].text : 'Non choisi';
    const villeText = villeSelect.value && !villeSelect.disabled ? villeSelect.options[villeSelect.selectedIndex].text : 'Non choisi';
    
    // Paiement : récupérer le label associé
    const payVal = data.get('paiement');
    const payLabel = payVal ? document.querySelector(`input[name="paiement"][value="${payVal}"] + label`)?.textContent : 'Non choisi';
    
    // Assurances : récupérer les valeurs cochées et les formater
    const assValues = data.getAll('assurance[]');
    const assLabels = assValues.map(v => {
        const lbl = document.querySelector(`input[name="assurance[]"][value="${v}"] + label`)?.textContent;
        return lbl || v;
    });
    const assText = assLabels.length > 0 ? assLabels.join(', ') : 'Aucune';
    
    // Construction du HTML
    const html = `
        <ul>
            <li><strong>Identité :</strong> <span>${val('prenom')} ${val('nom')}</span></li>
            <li><strong>Téléphone :</strong> <span>${val('indicatif', '')} ${val('telephone')}</span></li>
            <li><strong>Email :</strong> <span>${val('email')}</span></li>
            <li><strong>Âge :</strong> <span>${val('age')}</span></li>
            <li><strong>Adresse :</strong> <span>${val('adresse')}</span></li>
            <li><strong>Destination :</strong> <span>${destText}</span></li>
            <li><strong>Ville :</strong> <span>${villeText}</span></li>
            <li><strong>Personnes :</strong> <span>${val('nb_personnes')}</span></li>
            <li><strong>Durée :</strong> <span>${val('duree')}</span></li>
            <li><strong>Assurance :</strong> <span>${assText}</span></li>
            <li><strong>Paiement :</strong> <span>${payLabel}</span></li>
            <li><strong>Code sécurité :</strong> <span>${data.get('code_securite') ? '•••• (Masqué)' : 'Non renseigné'}</span></li>
        </ul>
    `;
    
    // Injection et affichage
    infoContent.innerHTML = html;
    infoPanel.style.display = 'block';
    infoPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Écouteurs
btnInfo?.addEventListener('click', afficherRecap);
closeInfoBtn?.addEventListener('click', () => {
    infoPanel.style.display = 'none';
});
form?.addEventListener('reset', () => {
    infoPanel.style.display = 'none';
});