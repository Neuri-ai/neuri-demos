import { useState } from 'react';
import NMicrophone from 'components/Microphone';
import './style.css';
import './formfill.style.scss';
import { useEffect } from 'react';
import gsap from 'gsap';

const FormFill = () => {
	const [imgClass, setImgClass] = useState('')

	const Matriz = () => {
		
	}

	useEffect(() => {
		let tl = gsap.timeline();
		tl.fromTo('#DemoFFSection',{
			scale: 0.7, opacity: 0
		},{
			scale: 1, opacity: 1
		})
		tl.fromTo('#vffnmicro',{
			opacity: 0
		},{
			opacity: 1
		})
	},[])

	return (
		<>
			<section id="DemoFFSection">
				<form id="DemoFFGrid">
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
								<input type="time" defaultValue="08:00"></input>
							</div>
						</div>
						<div className="off">
							<label>Drop off Date</label>
							<div className="inputs">
								<input type="date"></input>
								<input type="time" defaultValue="13:00"></input>
							</div>
						</div>
					</div>
					<button type="submit" id='dffsbtn'>Search</button>
				</form>
			</section>
			<div id="vffnmicro" onClick={() => setImgClass( imgClass === '' ? 'active' : '' )}>
				<NMicrophone state={imgClass} />
			</div>
		</>
	)
}
export default FormFill