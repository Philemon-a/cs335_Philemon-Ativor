// input field
const idField = document.getElementById('idField');
const dataField = document.getElementById('dataField');

// buttoms
const readAllBtn = document.getElementById('readAllBtn');
const readBtn = document.getElementById('readBtn');
const createBtn = document.getElementById('createBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');

// container
const resultDiv = document.getElementById('results')


createBtn.addEventListener('click', ()=>{
  fetch('/data', {
    method: 'POST',
    headers: {'content-Type': 'application/json'},
    body: dataField.value

  })
  .then(r=>r.json())
  .then(doc=>{
    resultDiv.innerHTML = '';
    resultDiv.innerHTML += JSON.stringify(doc, null, 2)
  })
})

updateBtn.addEventListener('click', ()=>{
  fetch('/data/'+idField.value, {
    method: 'PATCH',
    headers: {'content-Type': 'application/json'},
    body: dataField.value
  })
  .then(r=>r.json())
  .then(doc=>{
    resultDiv.innerHTML = '';
    resultDiv.innerHTML += JSON.stringify(doc, null, 2)
  })

})

readAllBtn.addEventListener('click', ()=>{
  fetch('/data/')
  .then(r=>r.json())
  .then(doc=>{
    resultDiv.innerHTML = '';
    resultDiv.innerHTML += JSON.stringify(doc, null, 2)
  })
})
readBtn.addEventListener('click', ()=>{
  fetch('/data/'+idField.value)
  .then(r=>r.json())
  .then(doc=>{
    resultDiv.innerHTML = '';
    resultDiv.innerHTML += JSON.stringify(doc, null, 2)
  })
})