<script setup>
import {ref, defineProps} from "vue";
const props=defineProps({ 'elements':Object, 'currentPage':Number, 'changePage':Function});
function formatLabel(label) {
  return label
    .replace(/&laquo;/g, '<')
    .replace(/&raquo;/g, '>')
    .replace('Previous', '')
    .replace('Next', '')
    .replace(' ',''); //mandatory wthout spaces because I compare this value to > and < bellow
};

const extractPageNumber = (url) => {
  if (!url) return null;
  const params = new URLSearchParams(new URL(url).search);
  return params.get('page') || 1;
};


function vizible_page(nrpage, currentpage, lastpage)
{
  //console.log(nrpage);
  if (nrpage==0) return currentpage!=1;//for < -- vizible only if not in 1 page
  if (nrpage==-1) return currentpage!=lastpage;//for > -- vizible only if not in last page
  
   //console.log((nrpage<=3)&&(nrpage<=lastpage));
  if (currentpage==1) return (nrpage<4)&&(nrpage<=lastpage);
  if (currentpage>=lastpage) return (nrpage>=lastpage-2)&&(nrpage>=1);
  
  return (nrpage>=currentpage-1)&&(nrpage<=currentpage+1)&&(nrpage<=lastpage)&&(nrpage>=1);
}
</script>
<template>
<nav class="d-flex justify-content-center" id="paginationNav">
  <ul class="pagination">
   
    <template v-if="elements && elements.links && elements.links.length > 0">
    <li class="page-item">
      <button :class="`${currentPage>1?'page-link':'page-link disabled'}`" 
       @click="props.changePage(1)"
       aria-label="First">
        <span aria-hidden="true" :class="`${currentPage>1? 'active2':'disabled'}`">&laquo;</span>
      </button>
    </li>

    <li v-for="(link, index) in elements.links"
        :key="index"
        :class="['page-item', { active: link.active,
         disabled: !link.url||!(vizible_page(((formatLabel(link.label)=='>')? -1: ((formatLabel(link.label)=='<')? 0 : extractPageNumber(link.url))), currentPage, elements.last_page ))
          }]">
      <template v-if="(vizible_page(((formatLabel(link.label)=='>')? currentPage: ((formatLabel(link.label)=='<')? currentPage : extractPageNumber(link.url))), currentPage, elements.last_page ))">
        <button 
              @click="link.url?changePage(extractPageNumber(link.url)): null "
              class="page-link">
        <span>{{formatLabel(link.label)}}</span>
       </button>
      </template>
      
    </li>
  
     <li class="page-item">
      <button :class="`${elements.last_page>currentPage?'page-link':'page-link disabled'}`" 
      @click="changePage(elements.last_page)" 
      aria-label="Last">
        <span aria-hidden="true" :class="`${elements.last_page>currentPage? 'active2' : 'disabled'}`">&raquo;</span>
      </button>
    </li>
</template>

  </ul>
</nav>   

</template>

<style scoped>
.pagination .page-item{margin-right:5px;}
.pagination .page-item:first-of-type .page-link, .pagination .page-item:last-of-type .page-link {border-radius:50%;}
.pagination .page-link{color: #7e40f6 ; border-radius: 50%;}
.pagination .page-link:hover{opacity:0.8;}
.pagination .active>.page-link{background-color: blueviolet!important;color:white;}
.pagination span.disabled{color:darkgray!important;}
.custom-background{
  background: rgba(126, 64, 246, 1)!important;
  border:none!important;
  border-radius: 2em!important;
  
  border: 2px solid rgba(255, 255, 255, 0.05)!important;
  
  box-shadow: 10px 10px 10px rgba(46, 54, 68, 0.03)!important;
} 

table {border-radius: 2em!important;}
tr, td{
  background-color: rgba(24, 24, 16, 0.2)!important;
  color:white!important;
}

th{
  background-color: rgba(126, 64, 246, 0.8)!important;
  color:white!important;
}

 tr,th:first-of-type {
  border-top-left-radius: 2em!important;
  }

  tr,th:last-of-type {
  border-top-right-radius: 2em!important;
  }
  
  tr:last-of-type, tr:last-of-type td:first-child   {
  border-bottom-left-radius: 2em!important;
  }

  tr:last-of-type, tr:last-of-type td:last-child  {
  border-bottom-right-radius: 2em!important;
  }

  /*#addNewTaskButton{color:white; background:#7e40f6; border-radius: 2em!important;
          margin-bottom:1em;}*/

.page-link.disabled {
  pointer-events: none;
  color: #ccc;
}
  
</style>