import axios from 'axios'
import order, { countDocuments } from '../../model/order';

$("input:checkbox").change(function() {
    var ischecked= $(this).is(':checked');
    if(ischecked){
    //  alert('uncheckd ' + $(this).val());
   
 let data =$(this).val()
 axios.get(`/filterData/${data}`,{
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    }
}).then(res => {
        
        // console.log(res.data);
        let orders = res.data
        
       let markup = generateMarkup(orders)
        orderTableBody.innerHTML += markup
        }).catch(err => {
           console.log(err);
               
        })
    }else {
      axios.get('/filterdatas',{
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        }
    }).then(res => {
            
            // console.log(res.data);
            let orders = res.data
            
           let markup = generateMarkup(orders)
            orderTableBody.innerHTML += markup
            }).catch(err => {
               console.log(err);
                   
            })
    }
}); 

var orderTableBody = document.querySelector('#orderTableBody')

 function generateMarkup(orders) {
     console.log(orders);
    // let parsedItems = Object.values(orders)
     
    return orders.map((orders) => {
        return `
        <div class="product-item">
        <div class="item-inner">
          <div class="product-thumbnail">
          
          
         
            <div class="pr-img-area"> <a title=" ${ orders.title }  " href="/single_product">
             <div class="pr-img-area"> <a title=" " href="/single_product">
            <figure> <img class="first-img" src="/productImage/${ orders._id}/${ orders.image}  " alt=" "> <img class="hover-img" src="/productImage/${ orders._id}/${ orders.hover}" alt=" "></figure>
            </a>  </div>
             
            <div class="pr-info-area">
              <div class="pr-button">
                <div class="mt-button add_to_wishlist"> <a href=""> <i class="pe-7s-like"></i> </a> </div>
                <div class="mt-button add_to_compare"> <a href=""> <i class="fa fa-eye"></i> </a> </div>
              </div>
            </div>
          </div>

          <div class="item-info">
            <div class="info-inner">
              <div class="item-title"> <a title="Product title here">${ orders.title } <span>(${ orders.code })</span> </a> </div>
              
              <div class="item-content">
                <div class="rating"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star-o"></i> <i class="fa fa-star-o"></i> <i class="fa fa-star-o"></i> </div>
                <div class="item-price">
                  <div class="price-box"> <span class="regular-price"> <span class="price"><i class="fa fa-rupee"></i>${ orders.price } </span> </span> </div>
                </div>
                <div class="pro-action">
                  <button type="button" class="add-to-cart"> <i class="fa fa-shopping-bag"></i><span> Add to Cart</span> </button>
                 
                </div>
               
              </div>
            </div>
          </div>



          
        </div>
      </div>
        `
    }).join('')
    
    }

    $(document).on('change','.member_dropdown', function()
    {
    
      var data = $(this).val();
   
      axios.get(`/log/${data}`,{
        headers: {
            "X-Requested-With": "XMLHttpRequest",
        }
    }).then(res => {
            
            console.log(res.data);
            let orders = res.data
            
           let markup = generateMarkup(orders)
           select.innerHTML = markup
            }).catch(err => {
               console.log(err);
                   
            })
        
    });
 
 
    $(document).ready(function(){
 
      $("#select").change(function(){
       var data = $('#select').val(); 
          // alert (data); 
          axios.get(`/catgetFiltersubCat/${data}`,{
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            }
        }).then(res => {
                
                // console.log(res.data);
                let result = res.data
                
               let markup = generatecatMarkup(result)
               selecting.innerHTML = markup
                }).catch(err => {
                   console.log(err);
                       
                })
      });
       
      });
  
  
   
    var selecting = document.querySelector('#selects')
    function generatecatMarkup(result){
        
         return result.map((data) => {
          return `
      
          <option  value="${ data.subCategory }" ? 'selected' : ''>${ data.subCategory }</option>
          `
      })
      
    }
   