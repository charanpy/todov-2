const express=require("express");
//body-parser
const bodyParser=require("body-parser");
const app=express();
//EJS
app.set('view engine','ejs');
//Lodash
const lodash=require("lodash");
//Activate body-parser
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
//mongoose
const mongoose=require("mongoose");
//connection
const depreceate={ useNewUrlParser: true , useUnifiedTopology: true };
mongoose.connect("mongodb://localhost:27017/todolist",depreceate);
//Schema
const itemSchema={
	name:String
};
//model
const Item=mongoose.model("Item",itemSchema);
//doc
const item1=new Item({
	name:"	Welcome to your todolist"
});
const item2=new Item({
	name:"Hit + button to add item"
});
const item3=new Item({
	name:"Hit - button to delete item"
});
const defaultItem=[item1,item2,item3];
const listSchema={
	name:String,
	item:[itemSchema]
};
const List=mongoose.model("List",listSchema);
app.get("/",function(req,res) {
//Find
Item.find({},function(err,foundItem) {
	if(foundItem.length ===0){
		Item.insertMany(defaultItem,function(err){
			if(err){
				console.log(err);
			}
			else{
				console.log("Inserted");
			}
		});
		res.redirect("/");
	}
	else{
		res.render("list",{kindofDay:"Today",newitem:foundItem});
	}
});
});
app.post("/",function(req,res){
	const itemName=req.body.newitem;
	const listNa=req.body.list;
	const item=new Item({
		name:itemName
	});
	if(listNa==="Today"){
		item.save();
		res.redirect("/");}
		else {
			List.findOne({name:listNa},function(err,foundList){
				foundList.item.push(item);
				foundList.save();
				res.redirect("/"+listNa);
			});
		}

	});
app.post("/delete",function(req,res){
	const deleteItem=req.body.checkbox;
	const lis=req.body.listName;
	if(lis === 
		"today"){
		Item.findByIdAndRemove(deleteItem,function(err){
			if(err){
				console.log(err)
			}
			else{
				res.redirect("/");
				console.log("Deleted")
			}
		});
}
else{
	List.findOneAndUpdate({name:lis},{$pull:{item:{_id:deleteItem}}},function(err,foundList){
		if(!err){
			res.redirect("/"+lis);
		}
	});
e}

});
app.get("/:heading",function(req,res){
	const listNames=req.params.heading;
	List.findOne({name:listNames},function(err,foundList){
		if(!err){
			if(!foundList){
				//nEW LIST
				const list= new List({
					name:listNames,
					item:defaultItem
				});
				list.save();
				res.redirect("/"+listNames);
				
			}
			else{
				//RENDERING EXISTING LIST
				res.render("list",{kindofDay:foundList.name,newitem:foundList.item})
			}
		}
	});
	
});
app.listen(3000,function(){
	console.log("server started");
});