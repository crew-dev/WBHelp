let data
let namecategorys
let searchvalue = [];
let selectedСategory
let inputValue


(function () {
  const app = "https://script.google.com/macros/s/AKfycbwifPHkU9oKvU4zSt0lTedMCR-AZxB4YmjcPXq0htNLJ1AewZ0EPJu_VgtEgMDIvXb3bQ/exec",
  output = '',
  xhr = new XMLHttpRequest();
  xhr.open('GET', app);
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    if (xhr.status == 200) {
       try {
           let r = JSON.parse(xhr.responseText),
              result = r["result"];

            data = result
            data.splice(0,1)
            namecategorys = []
            let categorys = {}
            let html = ''

            for (let i = 0; i < data.length; i++) {
              const element = data[i];
              const id = element[0]
              const category = element[1]
              const product = element[2]
              searchvalue.push(product)
              let f = namecategorys.filter(el=>String(el).toLowerCase() === String(category).toLocaleLowerCase())
              if (f[0] === undefined) {
                namecategorys.push(category)
                categorys[category] = []
              }
              categorys[category].push([product, id])
            }

            for (let i = 0; i < namecategorys.length; i++) {
              const element = namecategorys[i];
              const products = categorys[element]
              let producthtml = ''
              for (let i = 0; i < products.length; i++) {
                const product = products[i];
                producthtml = producthtml + `<p class="product" id="productId ${product[1]}" >${product[0]}</p>`
              }

              html = html + `
                <div class="panel ">
                  <div class="panel-heading " role="tab" id="headingOne categoryId ${i}" >
                      <h4 class="panel-title ">
                          <a role="button" data-toggle="collapse" data-parent="#accordion"
                              href="#collapseOne" aria-expanded="true" aria-controls="collapseOne" >
                              ${element}
                          </a>
                      </h4>
                  </div>
                  <div id="collapseOne categoryId ${i}" class="panel-collapse collapse in" role="tabpanel"
                      aria-labelledby="headingOne">
                      <div class="panel-body ">
                        ${producthtml}
                      </div>
                  </div>
              </div>
              `

            }

            document.getElementById('accordion').innerHTML = html;

            $( "#input-search" ).autocomplete({
              source: searchvalue,
              minLength: 4
            });
            document.querySelectorAll('.product').forEach(el => el.addEventListener("click",()=>productEvent(el),true))
            document.querySelectorAll('.panel-heading').forEach(el => el.addEventListener("click",()=>categoryEvent(el),true))

       } catch(e) {}
    }
  }
  xhr.send()
})()

function categoryEvent(teg){
  let elements = document.getElementsByClassName('panel-collapse');
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if(element !== teg.parentNode.children[1] && element.classList.contains('visiblePanel') == true){
      element.classList.toggle('visiblePanel')
      element.parentNode.children[0].classList.toggle('active')
    }
  }
  teg.parentNode.children[1].classList.toggle('visiblePanel')
  teg.classList.toggle('active')
}

$('#input-categ').on('click',function(){
  accordeonEvent()
})


function accordeonEvent(){
  let element =  document.querySelector('.accordeon__content');

  // opening the accordion
  document.querySelector('.accordeon').classList.add('visible');
  element.id='accordeon__content__visible'
  document.querySelector('.accordeon').classList.toggle('op')

  // close the accordion
  $(document).mouseup(function (e){
    let div = $(".accordeon");
    let input = $('#input-categ');
    if (!div.is(e.target)                         // if the click was not on the accordion
        && !input.is(e.target)                    // and if the click was not on input
        && div.has(e.target).length === 0 ) {     // and not by accordion children
      element.id='accordeon__content'
      let elements = document.getElementsByClassName('panel-collapse');
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if(element.classList.contains('visiblePanel') == true){
          element.classList.toggle('visiblePanel')
          element.parentNode.children[0].classList.toggle('active')
        }
      }
      document.querySelector('.accordeon').classList.remove('visible')
      setTimeout(() => document.querySelector('.accordeon').classList.add('op'), 300)
    }
  });
  document.getElementById('input-search').value = ''
}


document.getElementById('input-search').addEventListener("change", function (evt) {
inputValue = this.value
}, false);

document.getElementById('input-search-btn').addEventListener("click", function (evt) {
  for (var i = 0; i < data.length; i++){
    let f = data[i].filter(el=> String(el).toLocaleLowerCase().indexOf(inputValue.toLocaleLowerCase()) !== -1)
    if (f[0] !== undefined){ 
      let idCategory = namecategorys.indexOf(data[i][1])
      let teg = document.getElementById('collapseOne categoryId '+ String(idCategory))
      let teg2 = document.getElementById('headingOne categoryId '+ String(idCategory))

      if(teg2.classList.contains("active") === false){
        teg2.classList.toggle("active")
      }

      if(teg.classList.contains("visiblePanel") === false){
        teg.classList.toggle("visiblePanel")
      }

      document.getElementById(`productId ${data[i][0]}`).scrollIntoView();
      
      let elements = document.getElementsByClassName('panel-collapse');
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if(element !== teg.parentNode.children[1] && element.classList.contains('visiblePanel') == true){
          element.classList.toggle('visiblePanel')
          element.parentNode.children[0].classList.toggle('active')
        }
      }
      break
    }
  }
}, false);



function productEvent(teg){
  teg.parentNode.parentNode.classList.toggle("visiblePanel")
  teg.parentNode.parentNode.parentNode.children[0].classList.toggle('active')
  
  let element =  document.querySelector('.accordeon__content');
  document.querySelector('.accordeon').classList.toggle('visible');
  (element.getAttribute('id') === 'accordeon__content'? element.id='accordeon__content__visible' : element.id='accordeon__content' )
  if(document.querySelector('.accordeon').classList.contains('op') == true){
    document.querySelector('.accordeon').classList.toggle('op')
  }
  else{
    setTimeout(() => document.querySelector('.accordeon').classList.toggle('op'), 300)
  }

  for (var i = 0; i < data.length; i++){
    let f = String(data[i][2]).toLocaleLowerCase() === teg.textContent.toLocaleLowerCase()
    if(f === true){ 
        document.getElementById('input-categ').value = String(data[i][1]) + ' ' + String(data[i][2])
        selectedСategory = data[i][0]
        
        console.log(f)
        console.log(data[i])
      break
    }
  }
  document.getElementById('input-search').value = ''
}






function getValues(){
  let size = data[selectedСategory-1][8]
  let w = document.querySelector('input[name="payment"]:checked').value;
  let tax = document.querySelector('input[name="payment2"]:checked').value;
  let Tx = parseFloat(Number(document.getElementsByClassName('input-setting x')[0].value))
  let Ty = parseFloat(Number(document.getElementsByClassName('input-setting y')[0].value))
  let Tz = parseFloat(Number(document.getElementsByClassName('input-setting z')[0].value))
  let Sp = parseFloat(Number(document.getElementsByClassName('input-price Sp')[0].value))
  let St = parseFloat(Number(document.getElementsByClassName('input-price St')[0].value))
  let Q = parseFloat(Number(document.getElementsByClassName('input-price Q')[0].value))
  let R = parseFloat(Number(data[selectedСategory-1][9]))
  let Sf = parseFloat(Number(data[selectedСategory-1][7]))
  let Pf = parseFloat(Number(data[selectedСategory-1][10]))

  let L
  if(size == "Нет"){
    L = parseFloat(Number(data[selectedСategory-1][5]).toFixed(2))
  }
  if(size == "Да"){
    L = parseFloat(Number(Tx*Ty*Tz*1.5/1000).toFixed(2))
    if( L< 105){
      L = 105
    }
  }

  let Kwp 
  if(w == '1'){
    Kwp = parseFloat(Number(data[selectedСategory-1][3]).toFixed(2))
  }
  if(w == '2' | '3'){
    Kwp = parseFloat(Number(data[selectedСategory-1][4]).toFixed(2))
  }

  let taxp
  if(tax == 1) {
    taxp =  parseFloat(Number((0.06*(Sp-L-R-Sf-Sp/100*Kwp)).toFixed(2)))
  }
  if(tax == 2) {
    taxp  = parseFloat(Number((0.15*(Sp-St-L-R-Sf-Sp/100*Kwp)).toFixed(2)))
  }

  let CU
  if(w == '1'){
    CU = parseFloat(Number((St+L+R+Sf+Sp/100*Kwp+taxp)).toFixed(2))
  }
  if(w =='2'){
    CU = parseFloat(Number((St+L+R+Pf+Sp/100*Kwp+taxp)).toFixed(2))
  }
  if(w == '3'){
    CU = parseFloat(Number((St+R+Pf+Sp/100*Kwp+taxp)).toFixed(2))
  }

  let Mg = parseFloat(Number(((Sp-CU)/Sp)).toFixed(2))
  let EU = parseFloat(Number((Sp-CU)).toFixed(2))
  let CT = parseFloat(Number((CU*Q)).toFixed(1))
  let ET = parseFloat(Number(((Sp-CU)*Q)).toFixed(2))


  let xz = {size: size, w: w, tax: tax, Sp: Sp, St: St, Q:Q, L:L, R:R, Sf:Sf, Pf:Pf, Tx:Tx,Ty:Ty, Tz:Tz, Kwp:Kwp, taxp:taxp, CU:CU, Mg:Mg, EU:EU, CT:CT, ET:ET}
  return xz
}


document.querySelector('.button-calculator').addEventListener('click', () => {
  let value = getValues()
  document.getElementsByClassName('calculator__sidebar-right')[0].innerHTML = String(value.Kwp)+'%'
  document.getElementsByClassName('calculator__sidebar-right')[1].innerHTML = String(value.L)+' ₽'
  document.getElementsByClassName('calculator__sidebar-right')[2].innerHTML = String(value.Sf)+' ₽'
  document.getElementsByClassName('calculator__sidebar-right')[3].innerHTML = String(value.taxp)+' ₽'
  document.getElementsByClassName('calculator__sidebar-right')[4].innerHTML = String(value.Mg)+' ₽'
  document.getElementsByClassName('calculator__sidebar-right')[5].innerHTML = String(value.CU)+' ₽'
  document.getElementsByClassName('calculator__sidebar-right')[6].innerHTML = String(value.EU)+' ₽'
  document.getElementsByClassName('calculator__sidebar-right')[7].innerHTML = String(value.CT)+' ₽'
  document.getElementsByClassName('calculator__sidebar-right')[8].innerHTML = String(value.ET)+' ₽'
  }
)