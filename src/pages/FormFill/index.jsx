import './style.css';

const FormFill = () => {
	return (
		<section className="DemoFFSection">
			<form className="DemoFFGrid">
				<label id='DFG1'>
					<p>Pick up location</p>
					<input type="text" className=''></input>
				</label>
				<label id='DFG2'>
					<p>Drop off location</p>
					<input placeholder="Same as pick up location" type="text"></input>
				</label>
				<div id='DFG3'>
					<div className="off">
						<label>
							<p>Pick up Date</p>
							<input type="date"></input>
						</label>

						<label>
							<input type="time"></input>
						</label>
					</div>
					<div className="off">
						<label>
							<p>Drop off Date</p>
							<input type="date"></input>
						</label>
						<label>
							<input type="time"></input>
						</label>
					</div>
				</div>
				<button type="submit" id='DFFBtn'>Search</button>
			</form>
		</section>
	)
}
export default FormFill