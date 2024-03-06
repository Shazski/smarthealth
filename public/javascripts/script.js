const { response } = require("../../app")

function addToCart(proId){
    $.ajax({
        url:'/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $("#cart-count").html(count)
            }
            
        }
    })
}

function deleteCartItem(cartId,proId){
    $.ajax({
        url:'/delete-cart-items/'+proId,
        data:{
            cartid:cartId,
            productid:proId
        },
        method:'post',
        success:(response)=>{
            location.reload()
        }
    })
}

function changeQuantity(cartId,proId,userId,count){
    let quantity=parseInt(document.getElementById(proId).innerHTML)
    count=parseInt(count)
    $.ajax({
        url:'/change-product-quantity',
        data:{
            user:userId,
            cartid:cartId,
            productid:proId,
            count:count,
            quantity:quantity,
            
        },
        method:'post',
        success:(response)=>{
            console.log(response);
            if(response.removeProduct){
                alert("product is remmoved from the cart")
                location.reload()
            }else{
                document.getElementById(proId).innerHTML=quantity+count

                document.getElementById('total').innerHTML=response.total
            }
        }
    })
}
function clearCart(cartId){
    $.ajax({
        url:'/clear-all-cart/'+cartId,
        method:'get',
        
        success:(response)=>{
            if(response){
            location.reload()
            }else{
            }
        }
    })
}

function addToWish(proId){
    $.ajax({
        url:'/wishlist/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                let count=$('#wish-count').html()
                count=parseInt(count)+1
                $("#wish-count").html(count)
            }
        }
    })
}

function wishToCart(proId){
    $.ajax({
        url:'/wish-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response){
                location.reload()
                let count=$('#cart-count').html()
                count=parseInt(count)+1
                $("#cart-count").html(count)
            }
            
        }
    })
}