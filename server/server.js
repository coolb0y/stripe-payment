
require('dotenv').config();
const express = require('express');
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors({
    origin:'http://localhost:5500'
}));

console.log(process.env.STRIPE_PRIVATE_KEY)
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
// app.use(express.static('public'))


const storeItems = new Map([
    [1,{priceInCents:10000,name:"Learn Reactjs"}],
    [2,{priceInCents:20000,name:"Learn Vuejs"}]
]);

app.post('/create-checkout-session', async (req,res)=>{
   try{
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        mode:'payment',
        success_url:`${process.env.CLIENT_URL}/success.html`,
        cancel_url:`${process.env.CLIENT_URL}/cancel.html`,
        line_items:req.body.items.map(item=>{
           const storeItem = storeItems.get(item.id)
           return {
                price_data:{
                    currency:'usd',
                    product_data:{
                        name:storeItem.name
                    },
                    unit_amount:storeItem.priceInCents
                },
                quantity:item.quantity
           } 
        })
    })

    return res.status(200).json({url:"https://www.google.com"})
   }
   catch(e){
       res.status(500).json({error:e.message})
   }
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})