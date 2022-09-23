import './style.css';


const ProductFilter = () => {
    return(
    <div class="container">
	<div class="row" id="search">
		<form id="search-form" action="" method="POST" enctype="multipart/form-data">
			<div class="form-group col-xs-9">
				<input class="form-control" type="text" placeholder="Search" />
			</div>
			<div class="form-group col-xs-3">
				<button type="submit" class="btn btn-block btn-primary">Search</button>
			</div>
		</form>
	</div>  
	<div class="row" id="filter">
		<form>
			<div class="form-group col-sm-3 col-xs-6">
				<select data-filter="make" class="filter-make filter form-control">
					<option value="">Select Make</option>
					<option value="">Show All</option>
				</select>
			</div>
			<div class="form-group col-sm-3 col-xs-6">
				<select data-filter="model" class="filter-model filter form-control">
					<option value="">Select Model</option>
					<option value="">Show All</option>
				</select>
			</div>
			<div class="form-group col-sm-3 col-xs-6">
				<select data-filter="type" class="filter-type filter form-control">
					<option value="">Select Type</option>
					<option value="">Show All</option>
				</select>
			</div>
			<div class="form-group col-sm-3 col-xs-6">
				<select data-filter="price" class="filter-price filter form-control">
					<option value="">Select Price Range</option>
					<option value="">Show All</option>
				</select>
			</div>
		</form>
	</div>
	<div class="row" id="products">
		
	</div>
</div>
    )
}
export default ProductFilter