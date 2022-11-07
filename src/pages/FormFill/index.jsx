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
						<label>Pick up Date</label>
						<div className="inputs">
							<input type="date"></input>
							<input type="time" value="08:00"></input>
						</div>
					</div>
					<div className="off">
						<label>Drop off Date</label>
						<div className="inputs">
							<input type="date"></input>
							<input type="time" value="13:00"></input>
						</div>
					</div>
				</div>
				<button type="submit" id='DFFBtn'>Search</button>
			</form>
		</section>
	)
}
export default FormFill