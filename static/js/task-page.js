// this section is to ADD NEW TASK
let element;
let newtask;
let textnode;
let deletebutton;

// this code is to add task

  // add task code ends here

  // this code is to delete task

function deleted(){
  this.parentNode.remove();
 
}
// delete task code ends here



  let inputValue=''
  let count =0
  let previous_element = null;
  let task_title =null;

// this code is for the render function
function render() {
  newtask= document.createElement('li');
  let li = "li"+count 
  newtask.id =li;                             
  newtask.appendChild(document.createElement("br"));    

  deletebutton= document.createElement('button');  
  let del = "del"+count
  deletebutton.id =del
  deletebutton.title ='Delele'

  c = document.createElement('input');
  c.type="text"
  c.id ="textboox"+count

const wordCountDisplay = document.createElement('div');
wordCountDisplay.textContent = 'Word Count: 0';


document.body.appendChild(c);
document.body.appendChild(wordCountDisplay);
let element= document.createElement('div');
element.id = "content"+count

   c.addEventListener("input", function() {
    const inputValue = c.value.trim(); // Remove leading and trailing whitespace
    console.log(c.value)
    const words = inputValue.split(/\s+/).filter(word => word.length > 0);
    const wordCount =words.length;
    wordCountDisplay.textContent = `Word Count: ${wordCount}`;   
    //const taskTitle =c.value

    if (wordCount > 5)
    {
      alert("Word limit 5");
     // wordCountDisplay.textContent.splice(5)
    }
    
    
  });
element = document.createElement('div');
element.id = 'content'+count
let a = document.getElementById('target');
document.body.appendChild(element);
a.appendChild(element);

var check =document.createElement('button')
 


console .log(element.id,"This is element")
c.addEventListener("input", function() {

  let currentElement = event.target;
  let innerText = currentElement.value;
  element.innerText = innerText
  a.appendChild(element); 
  previous_element = element;
});
check.addEventListener('click',()=>
  {
    newtask.style.backgroundColor ='#FFFFE0'    
  c.disabled=true
  let taskTitle = c.value
  console.log(taskTitle,"im c.value")
  postData(taskTitle)
  });

  newtask.appendChild(c);

  var icon = document.createElement("i");
  icon.classList.add("fas","fa-trash");                                                                    
  //deletebutton.style.color = "white";                              
  deletebutton.classList.add("btn", "btn-danger");
  deletebutton.appendChild(icon);
  newtask.appendChild(deletebutton);                          
  document.getElementById('sortlist').appendChild(newtask);   
  deletebutton.addEventListener('click',deleted);            
  slist(document.getElementById("sortlist"));     

  check.classList.add("btn",'btn-success')
  var icon2 = document.createElement('i')
  icon2.classList.add("fas","fa-check","tick-icon");
  check.appendChild(icon2) 
  newtask.appendChild(check)
  check.title ='Save'
  
  
 newtask.addEventListener('click', () => 
 
 {
  
var btn_text= document.getElementById('T1')
 btn_text.disabled= false;
 var btn_image= document.getElementById('I1')
 btn_image.disabled= false;
 var btn_file= document.getElementById('F1')
 btn_file.disabled= false;
 var btn_publish= document.getElementById('P1')
 btn_publish.disabled= false;});
 count=count+1
 console.log(count)
 
}
function postData(taskTitle) {
  const data = {
    task_title: taskTitle,
  };

  return fetch('/task', {
    // headers: {
    //   'Content-Type': 'text/html'
    // },
    method: 'POST',
    body: JSON.stringify(data),
  })
  .then(function (response) {
    if (response.ok) {
      return response.text();
    } else {
      throw Error('Something went wrong');
    }
  })
    .then(function (responseData) {
      console.log(responseData);
    })
    .catch(function (error) {
      console.log(error);
    });
}



function postData_Content(textBox_Content){

  const data1 = {
    task_content: textBox_Content,
  };

  return fetch('/task', {
    // headers: {
    //   'Content-Type': 'text/html',
    // },
    method: 'POST',
    body: JSON.stringify(data1),
  })
    .then(function (response) {
      if (response.ok) {
        return response.text();
      } else {
        throw Error('Something went wrong');
      }
    })
    .then(function (responseData) {
      console.log(responseData);
    })
    .catch(function (error) {
      console.log(error);
    });

}

function addtask()
{
 e = document.getElementById('target')
 e.innerHTML = ''
    render();
 
}

// function uploadFile(file) {
  

  
// }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          


// this section is for the code of dragging tasks

function slist (target) {
    // (A) SET CSS + GET ALL LIST ITEMS
    target.classList.add("slist");
    let items = target.getElementsByTagName("li"), current = null;
  
    // (B) MAKE ITEMS DRAGGABLE + SORTABLE
    for (let i of items) {
      // (B1) ATTACH DRAGGABLE
      i.draggable = true;
      
      // (B2) DRAG START - YELLOW HIGHLIGHT DROPZONES
      i.ondragstart = e => {
        current = i;
        for (let it of items) {
          if (it != current) { it.classList.add("hint"); }
        }
      };
      
      // (B3) DRAG ENTER - RED HIGHLIGHT DROPZONE
      i.ondragenter = e => {
        if (i != current) { i.classList.add("active"); }
      };
  
      // (B4) DRAG LEAVE - REMOVE RED HIGHLIGHT
      i.ondragleave = () => i.classList.remove("active");
  
      // (B5) DRAG END - REMOVE ALL HIGHLIGHTS
      i.ondragend = () => { for (let it of items) {
          it.classList.remove("hint");
          it.classList.remove("active");
      }};
   
      // (B6) DRAG OVER - PREVENT THE DEFAULT "DROP", SO WE CAN DO OUR OWN
      i.ondragover = e => e.preventDefault();
   
      // (B7) ON DROP - DO SOMETHING
      i.ondrop = e => {
        e.preventDefault();
        if (i != current) {
          let currentpos = 0, droppedpos = 0;
          for (let it=0; it<items.length; it++) {
            if (current == items[it]) { currentpos = it; }
            if (i == items[it]) { droppedpos = it; }
          }
          if (currentpos < droppedpos) {
            i.parentNode.insertBefore(current, i.nextSibling);
          } else {
            i.parentNode.insertBefore(current, i);
          }
        }
      };
    }
   
  }
 // dragging of tasks code ends here

 // drag and drop main area

 function swap(){

var container = document.getElementById('target');
var draggableItems = container.querySelectorAll('.draggable1');
var draggedItem = null;

for (var i = 0; i < draggableItems.length; i++) {
  draggableItems[i].addEventListener('dragstart', function() {
    draggedItem = this;
    setTimeout(function() {
      draggedItem.style.display = 'none';
    }, 0);
  });

  draggableItems[i].addEventListener('dragend', function() {
    draggedItem.style.display = 'block';
    draggedItem = null;
  });
}

container.addEventListener('dragover', function(e) {
  e.preventDefault();
  var afterElement = getDragAfterElement(container, e.clientY);
  var draggableItem = draggedItem.parentNode.removeChild(draggedItem);
  container.insertBefore(draggableItem, afterElement);
});

function getDragAfterElement(container, y) {
  var draggableElements = [...container.querySelectorAll('.draggable1:not(.dragging)')];
  return draggableElements.reduce(function(closest, child) {
    var box = child.getBoundingClientRect();
    var offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}}

      


/// features code for textbox

function makeBold() {
  var selectedText = getSelectedText();
        if (selectedText) {
            var contentDiv = document.getElementById('content');
            var html = contentDiv.innerHTML;
            var boldText = '<b>' + selectedText + '</b>';
            var newHtml = html.replace(selectedText, boldText);
            contentDiv.innerHTML = newHtml;
        }
  
}

