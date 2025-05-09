import foodModel from '../models/foodModel.js';
import fs from "fs"

//add food item 
export const addFood = async (req ,res )=>{
                // console.log(req.file)
        let image_filename = `${req.file.filename}`;
        const food = new foodModel({
            name: req.body.name,
            description:req.body.description,
            price:req.body.price,
            category:req.body.category,
            image:image_filename
        })
        try {
                console.log(food);
                await food.save();
                res.json({success:true, message:"Food added"})
        } catch (error) {
            console.log(error)
            res.json({success:false, message:"Error"})
        }
}

//all food list 
export const listFood= async(req,res)=>{
        try {
                const foods = await foodModel.find({});
                res.json({success:true,data:foods})
        } catch (error) {
                console.log(error)
                res.json({success:false , message:"Error"})
        }
}

//remove food item 
export const removeFood =async (req ,res )=>{
    try {
            const food = await foodModel.findById(req.body._id)
            fs.unlink(`uploads/${food.image}` ,()=>{})

            await foodModel.findByIdAndDelete(req.body._id);
            res.json({success:true , message:"Food removed"})
    } catch (error) {
            console.log(error)
            res.json({success:false , message:"Error"})
    }
}