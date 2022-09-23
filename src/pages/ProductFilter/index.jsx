import { useState, useEffect } from 'react';
import './style.css';


const initialSate = [
	{
		make: "Gibson",
		model: "Les Paul",
		type: "Electric",
		price: "$3,000",
		image:
			"http://www.sweetwater.com/images/items/120/LPST5HTHDCH-medium.jpg?9782bd"
	},
	{
		make: "Gibson",
		model: "SG",
		type: "Electric",
		price: "$1,500",
		image: "http://www.sweetwater.com/images/items/120/SGSEBCH-medium.jpg?e69cfe"
	},
	{
		make: "Fender",
		model: "Telecaster",
		type: "Electric",
		price: "$2,000",
		image:
			"http://www.sweetwater.com/images/items/120/TelePLMPHB-medium.jpg?28e48b"
	},
	{
		make: "Fender",
		model: "Stratocaster",
		type: "Electric",
		price: "$2,000",
		image:
			"http://www.sweetwater.com/images/items/120/StratAMM3SB2-medium.jpg?dfd0a9"
	},
	{
		make: "Gretsch",
		model: "White Falcon",
		type: "Electric",
		price: "$5,000",
		image:
			"http://www.sweetwater.com/images/items/120/G613655GE-medium.jpg?9bfb0e"
	},
	{
		make: "Paul Reed Smith",
		model: "Custom 24",
		type: "Electric",
		price: "$5,000",
		image:
			"http://www.sweetwater.com/images/items/120/HBII10BGWB-medium.jpg?982763"
	},
	{
		make: "Gibson",
		model: "Hummingbird",
		type: "Acoustic",
		price: "$2,500",
		image: "http://www.sweetwater.com/images/items/120/SSHBHCNP-medium.jpg?11fbea"
	}
];


const ProductFilter = () => {

	const [data, setData] = useState(initialSate)


	useEffect(() => {
		if(data){
			data.map((data, key) => {
				let make = initialSate[key].make
				let model = initialSate[key].model
				let type = initialSate[key].type
				let price = initialSate[key].price
				let image = initialSate[key].image;
				var rawPrice = price.replace("$", "")
				var rawPrice = parseInt(rawPrice.replace(",", ""))
	
				console.log(make)
			})
		}
	}, [data])


	return (
		<div className="container product-filter-container">
			<div className="row" id="search">
				<form id="search-form" action="" method="POST" encType="multipart/form-data">
					<div className="form-group col-xs-9">
						<input className="form-control" type="text" placeholder="Search" />
					</div>
					<div className="form-group col-xs-3">
						<button type="submit" className="btn btn-block btn-primary">Search</button>
					</div>
				</form>
			</div>
			<div className="row" id="filter">
				<form>
					<div className="form-group col-sm-3 col-xs-6">
						<select data-filter="make" className="filter-make filter form-control">
							<option value="">Select Make</option>
							<option value="">Show All</option>
						</select>
					</div>
					<div className="form-group col-sm-3 col-xs-6">
						<select data-filter="model" className="filter-model filter form-control">
							<option value="">Select Model</option>
							<option value="">Show All</option>
						</select>
					</div>
					<div className="form-group col-sm-3 col-xs-6">
						<select data-filter="type" className="filter-type filter form-control">
							<option value="">Select Type</option>
							<option value="">Show All</option>
						</select>
					</div>
					<div className="form-group col-sm-3 col-xs-6">
						<select data-filter="price" className="filter-price filter form-control">
							<option value="">Select Price Range</option>
							<option value="">Show All</option>
						</select>
					</div>
				</form>
			</div>
			<div className="row" id="products">

			</div>
		</div>
	)
}
export default ProductFilter