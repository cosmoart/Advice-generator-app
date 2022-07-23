import { useState, useEffect } from 'react';
import styled from 'styled-components';

const AdviceCard = styled.article`
	position:absolute;
	top:50%;
	left:50%;
	transform:translate(-50%,-50%);
	padding: 3rem;
	background: var(--DarkGrayishBlue);
	border-radius: 10px;
	`
const AdviceNumber = styled.p`
	color: var(--NeonGreen);
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 3px;
	`
const AdviceQuote = styled.h1`
	color: var(--LightCyan);
	font-size: 28px;
	`
const AdviceButton = styled.button`
	border-radius: 50%;
	background: var(--NeonGreen);
	border: none;
	width: 3rem;
	height: 3rem;
	/* padding: 12px; */
	cursor: pointer;
	transition: box-shadow 0.2s ease-in-out;
	position:absolute;
	left:50%;
	top: calc(100% - (3rem / 2));
	transform: translate(-50%, 0);
	&:hover {
		box-shadow: 0px 0px 15px 5px var(--NeonGreen);
	}
	`
const Loader = styled.img`
	position:absolute;
	width: 6rem;
	top:50%;
	left:50%;
	transform:translate(-50%,-50%);
	`

function App() {
	const [advice, setAdvice] = useState(``);
	const [id, setId] = useState(``);
	const [quoteError, setQuoteError] = useState(false);

	const getAdvice = (id) => {
		let url = id === "" ? `https://api.adviceslip.com/advice` : `https://api.adviceslip.com/advice/${id}`;

		fetch(url).then(res => res.json()).then(data => {
			setAdvice(data.slip.advice);
			setId(data.slip.id);
			location.hash = data.slip.id;
		}).catch(err => {
			setQuoteError(true)
			location.hash = "404";
		});
	}

	useEffect(() => {
		if (location.hash === "") {
			setAdvice(`It is easy to sit up and take notice, what's difficult is getting up and taking action.`);
			return setId(`117`);
		};

		// If the hash is not a number
		if (isNaN(parseInt(location.hash.slice(1)))) {
			return setQuoteError(true);
		};

		// If the hash is greater than 224 or less than 1
		if (parseInt(location.hash.slice(1)) < 1 || parseInt(location.hash.slice(1)) > 224) {
			return setQuoteError(true);
		}
		getAdvice(location.hash.slice(1));
	}, []);

	useEffect(() => {
		// console.log(advice);
		return () => console.log(advice);
	}, [advice]);

	return (
		<>
			{id === "" && !quoteError ? <Loader src='loader.svg' alt='Loading...' /> : <AdviceCard>
				{
					quoteError ? <>
						<AdviceNumber>Advice #404</AdviceNumber>
						<AdviceQuote>“Happiness not found”</AdviceQuote>
					</> : <>
						<AdviceNumber>Advice #{id}</AdviceNumber>
						<AdviceQuote>“{advice}”</AdviceQuote>
					</>
				}
				<picture>
					<source media="(min-width: 768px)" srcSet="pattern-divider-desktop.svg" />
					<source media="(max-width: 767px)" srcSet="pattern-divider-mobile.svg" />
					<img src="pattern-divider-desktop.svg" alt="" />
				</picture>
				<AdviceButton onClick={() => getAdvice("")}><img src="icon-dice.svg" title='Generate a new advice' />
				</AdviceButton>
			</AdviceCard>
			}
		</>
	)
}

export default App
