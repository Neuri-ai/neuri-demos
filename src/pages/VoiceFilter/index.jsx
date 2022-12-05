import { useState, useEffect } from 'react';
import SWApi from "helpers/StarWarsApi/StarWarsApi.json";
import NeuriMicro from 'components/Microphone';
import { Icons } from 'helpers/iconscall'
import custommicro from '../../assets/icons/microfono.png'
import './voicefilter.style.scss';
import { gsap, Power3 } from 'gsap';
import NeuriDrawer from 'components/Drawer';

const VoiceFilter = () => {
	const [SValue, setSValue] = useState(SWApi["initialFilter"])
	const DataBase = [...SWApi["people"]]
	const [filtered, setFiltered] = useState(DataBase.sort(() => Math.random() - 0.5))
	const [microState, setMicroState] = useState(false)

	useEffect(() => {
		let tl = gsap.timeline();
		let child = document.querySelectorAll('.dpfselect')
		tl.fromTo('#dpfoptions1', {
			scale: 0.5, opacity: 0
		}, { scale: 1, opacity: 1 })
		tl.to(child[0], { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut }, "<0.1")
		tl.to(child[1], { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut }, "<0.1")
		tl.to(child[2], { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut }, "<0.1")
		tl.to(child[3], { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut }, "<0.1")
		tl.to(child[4], { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut }, "<0.1")
		tl.to(child[5], { duration: 0.5, opacity: 1, y: 0, scale: 1, ease: Power3.easeInOut }, "<0.1")
		tl.fromTo('#dpfcardscontainer', {
			opacity: 0
		}, { opacity: 1 })
		tl.fromTo('#microdiv', {
			opacity: 0, scale: 1.5
		}, { opacity: 1, scale: 1 })
	}, [])

	const [ddownvalue, setDdownValue] = useState('type')
	const filteropt = SWApi['filter-options']

	const Dropselection = (opt1, opt2) => {
		console.log(opt1, opt2)
		const newSValue = { ...SValue, [opt1]: opt2 }

		let newFilter = DataBase.sort(() => Math.random() - 0.5);

		if (newSValue.films !== 'any') {
			newFilter = newFilter.filter(obj => {
				if (obj.films === undefined) return null
				if (obj.films.includes(newSValue.films) === true) { return obj }
			})
		}
		if (newSValue.gender !== 'any') newFilter = newFilter.filter(obj => { return obj.gender === newSValue.gender })
		if (newSValue.homeworld !== 'any') newFilter = newFilter.filter(obj => {
			if (obj.homeworld === undefined) return null
			if (obj.homeworld.includes(newSValue.homeworld) === true) { console.log('entre'); return obj }
		})
		if (newSValue.species !== 'any') newFilter = newFilter.filter(obj => { return obj.species === newSValue.species })
		if (newSValue.hairColor !== 'any') newFilter = newFilter.filter(obj => { return obj.hairColor === newSValue.hairColor })
		if (newSValue.eyeColor !== 'any') newFilter = newFilter.filter(obj => { return obj.eyeColor === newSValue.eyeColor })

		setSValue(newSValue)
		setFiltered(newFilter)
	}

	return (
		<section id='sectionvfilter'>
			<div id="dpfcontainer">
				<div id="dpfoptions1">
					<div tabIndex={2} className="dpfselect" onClick={() => setDdownValue('films')}>
						{(SValue.films === 'any')
							? <> <p className='pstandby'>Films</p>
								<img className='imgstandby' src={Icons.Arrow} alt="arrow" />	</>
							: <> <p className='pshow'>{SValue.films}</p>
								<img className='imgshow' src={Icons.X} alt="x" onClick={() => Dropselection('films', 'any')} /> </>
						}
					</div>
					{SWApi["mapfilters"]["people"].map((item, key) => {
						return (
							<div key={key} tabIndex={2} className="dpfselect" onClick={() => setDdownValue(item)}>
								{(SValue[item] === 'any')
									? <> <p className='pstandby'>
										{item === 'gender' && 'Gender'}
										{item === 'homeworld' && 'Home World'}
										{item === 'species' && 'Species'}
										{item === 'hairColor' && 'Hair Color'}
										{item === 'eyeColor' && 'Eye Color'}
									</p>
										<img className='imgstandby' src={Icons.Arrow} alt="arrow" />	</>
									: <> <p className='pshow'>{SValue[item]}</p>
										<img className='imgshow' src={Icons.X} alt="x" onClick={() => Dropselection(item, 'any')} /> </>
								}
							</div>
						)
					})}
					<div className={`dpfddlist`}>
						{filteropt[ddownvalue].map((item, key) => {
							return (
								<p key={key} onClick={() => Dropselection(ddownvalue, item)}>{item}</p>
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
			</div>
			<div id="microdiv" onClick={() => setMicroState(microState ? false : true)}>
				<NeuriMicro state={microState} />
			</div>
			<div id="drawerdiv">
				<NeuriDrawer props={{transcription: '', state: microState }}/>
			</div>
		</section>
	)
}
export default VoiceFilter