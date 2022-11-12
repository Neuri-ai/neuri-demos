import { useState, useEffect } from 'react';
import SWPeople from "helpers/StarWarsApi/people.json";
import SWPlanets from "helpers/StarWarsApi/planets.json";
import NMicrophone from 'components/Microphone';
import { Icons } from 'helpers/iconscall'
import './style.css';
import './productfilter.style.scss';
import gsap from 'gsap';

const ProductFilter = () => {
	const [SValue, setSValue] = useState({
		type: 'any', films: 'any', gender: 'any'
	})
	const DataBase = [...SWPeople, ...SWPlanets]
	const [filtered, setFiltered] = useState(DataBase.sort(() => Math.random() - 0.5))
	const [imgClass, setImgClass] = useState('')

	useEffect(() => {
		let tl = gsap.timeline();
		tl.fromTo('#dpfoptions1', {
			scale: 0.5, opacity: 0
		}, { scale: 1, opacity: 1 })
		tl.fromTo('#dpfcardscontainer', {
			opacity: 0
		}, { opacity: 1 })
		tl.fromTo('#microdiv', {
			opacity: 0, scale: 1.5
		}, { opacity: 1, scale: 1 })
	},[])

	const [ddownvalue, setDdownValue] = useState('type')
	const [filteropt, setFilterOpt] = useState({
		type: ["people","planet"], films: ["Episode 1", "Episode 2"]
	})

	const Dropselection = ( opt1, opt2 ) => {
		const newSValue = { ...SValue, [opt1]: opt2 }
		setSValue(newSValue);

		let newFilter = DataBase.sort(() => Math.random() - 0.5);

		if (newSValue.type !== 'any') newFilter = newFilter.filter(obj => { return obj.type === newSValue.type })
		if (newSValue.films !== 'any') newFilter = newFilter.filter(obj => { return obj.type === newSValue.films })
		if ((newSValue.type === 'people' && newSValue.gender !== 'any')) newFilter = newFilter.filter(obj => { return obj.gender === newSValue.gender })

		setFiltered(newFilter)
	}

	return (
		<div id="dpfcontainer">
			<div id="dpfoptions1">
				<div tabIndex={1} className="dpfselect" onClick={() => setDdownValue('type')}>
					<p>Type</p>
					<img src={Icons.Arrow} alt="arrow" />
				</div>
				<div tabIndex={2} className="dpfselect" onClick={() => setDdownValue('films')}>
					<p>Films</p>
					<img src={Icons.Arrow} alt="arrow" />
				</div>
				<div className={`dpfddlist`}>
					{ filteropt[ddownvalue].map((item, key) => {
						return (
							<p key={key} onClick={() => Dropselection( ddownvalue, item )}>{item}</p>
						)
					})}
				</div>
			</div>
			<div id="dpfcardscontainer">
				{filtered.map((item, key) => {
					return (
						<div className="pfcards" key={key}>
							<div className="dpfimage">
								<img src={item.image} alt="ilustrative" />
							</div>
							<div className="pfinfo">
								{item.name !== undefined && <div className="pfseparator"><p>Name:</p><p>{item.name}</p></div>}
								{item.gender !== undefined && <div className="pfseparator"><p>Gender:</p><p>{item.gender}</p></div>}
								{item.height !== undefined && <div className="pfseparator"><p>Height:</p><p>{item.height} cm</p></div>}
								{item.homeworld !== undefined && <div className="pfseparator"><p>Home world:</p><p>{item.homeworld}</p></div>}
								{item.population !== undefined && <div className="pfseparator"><p>Population:</p><p>{item.population}</p></div>}
								{item.gravity !== undefined && <div className="pfseparator"><p>Gravity:</p><p>{item.gravity}</p></div>}
								{item.terrain !== undefined && <div className="pfseparator"><p>Terrain:</p><p>{item.terrain}</p></div>}
							</div>
						</div>
					)
				})}
			</div>
			<div id="microdiv" onClick={() => setImgClass( imgClass === '' ? 'active' : '' )}>
				<NMicrophone state={imgClass} />
			</div>
		</div>
	)
}
export default ProductFilter