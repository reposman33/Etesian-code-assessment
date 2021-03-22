import React, { useState, useEffect } from "react";
import { getNextPrime } from "./getPrime";
import "./index.css";

export default function App() {
	const ALBUMS_URL = "https://jsonplaceholder.typicode.com/albums"
	const CATEGORIES_URL = "https://fakerapi.it/api/v1/custom?_quantity=10&id=counter&score=number&naam=name&categorie=country";
	const pageSize = 10;

	const [albums, setAlbums] = useState([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [maybePrime, setMaybePrime] = useState(0);
	const [categories, setCategories] = useState([]);
	const [lastPage, setLastPage] = useState(0);
	const [decimalNumber, setDecimalNumber] = useState(0);
	const [binaryNumber, setBinaryNumber] = useState(0);
	const [displayCategories, setDisplayCategories] = useState([]);

	const fetchAlbums = (url) => {
		fetch(url)
			.then(res => res.json())
			.then(res => {
				setAlbums(res);
			})
	}

	const fetchCategories = (url) => {
		fetch(url, {
			headers: {
				"content-type": "application/json"
			}
		})
		.then(res => res.json())
			.then(res => {
				setCategories(res.data);
				setDisplayCategories(res.data);
			})
	}

	useEffect(
		() => {
			fetchAlbums(ALBUMS_URL);
			getCurrentPage();
		}, []
	)

	useEffect(
		() => fetchCategories(CATEGORIES_URL), []
	)

	useEffect(
		() => getCurrentPage(), [currentPage]
	);

	const getCurrentPage = () => {
		const startPage = (currentPage < 0) ? 0 : (currentPage >= pageSize) ? lastPage : currentPage;
		return albums.slice(startPage * pageSize, (startPage * pageSize) + pageSize - 1);
	}

	const paginate = (page) => setCurrentPage((page < 0) ? 0 : (page > pageSize) ? pageSize : page)
		
	const onChangePrime = (e) => setMaybePrime(e.target.value)

	const onChangeDecimal = (e) => setDecimalNumber(e.target.value)

	const convertToBinary = (number) => {
		let base = number;
		let base2Logarithms = [];
		let log2;
		while (base > 0) {
			log2 = Math.log2(base);
			if (Number.isInteger(log2)) {
				base2Logarithms.push(log2)
				base = number - base2Logarithms.reduce((sum,log2) => sum + Math.pow(2,log2) ,0);
			} else {
				base -= 1;
			}
		}

		const result = new Array(base2Logarithms[0]).fill(0)
		const binaryArray = base2Logarithms.reverse().reduce((acc, log) => {
			acc.[log] = 1;
			return acc;
		}, result);

		setBinaryNumber(binaryArray.join(""));
	}

	/**
	 * 
	 * @param {number} rank - de <rank>e categorie op pscore gesorteerd 
	 * @returns {String} - de categorie
	 */
	const getCategoriesAtRank = (rank) => 
		categories.length > 0
			// array.sort muteert de array daarom sorteren we een kloon met array destructuring 
			? [...categories].sort((cat1, cat2) => cat1.score - cat2.score < 0 ? 1 : cat1.score - cat2.score > 0 ? -1 : 0)[rank].categorie
			: null;		

	/**
	 * 
	 * @param {event} e - het event object waar we de waarde van het input veld uit halen 
	 */
	const showCategoriesWithScoreAbove = (e) => {
		const score = e.target.value | 0;
		setDisplayCategories([...categories].filter(category => category.score > score))
	}

	return (
		<div>

			<p>
				1. Ophalen van data van een webapi (https://jsonplaceholder.typicode.com/)
			</p>
			<ol>
				<li>Haal de albums op van https://jsonplaceholder.typicode.com/albums</li>
				<li>Toon deze per 10, en zorg ervoor dat je kunt doorklikken naar de volgende items</li>
			</ol>

			<table className="albums">
				<tbody>
					{getCurrentPage(1).map(album =>
						<tr key={album.id}>
							<td>{album.title})</td>
						</tr>
					)}
				</tbody>
			</table>

			<div className="tableAlbumsButtons">
				<button onClick={() => paginate(currentPage - 1)}>Previous</button>
				<span>{currentPage} : {lastPage}</span>
				<button onClick={() => paginate(currentPage + 1)}>Next</button>
			</div>

			<div>
				<h4>Bepalen volgende priemgetal</h4>
				<input type="number" value={maybePrime} onChange={onChangePrime} />
				<span>{getNextPrime(maybePrime)}</span>
			</div>

			<div id="categories">
				<h4>Maak een lijst van objecten, met de eigenschappen: id, score, naam, categorie</h4>
				<ol>
					<li>Toon in de lijst alleen waar score > <input type="number" step="1" onChange={showCategoriesWithScoreAbove}/></li>
					<li>Toon van elke categorie het item met de hoogste waarde (???)</li>
					<li>Toon de items van de categorie met de hoogste score:
						<span>{getCategoriesAtRank(0)}</span>
					</li>
					<li>Toon de items van de categorie met de op 1 na hoogste score:
						<span>{getCategoriesAtRank(1)}</span>
					</li>
				</ol>
				<table>
					<thead>
						<tr>
							<th>id</th>
							<th>Score</th>
							<th>Naam</th>
							<th>Categorie</th>
						</tr>
					</thead>
					<tbody>
						{
							displayCategories.length && displayCategories.map(category =>
								<tr key={category.id}>
									<td> {category.id}</td>
									<td> {category.score}</td>
									<td> {category.naam}</td>
									<td> {category.categorie}</td>
								</tr>
							)
						}
					</tbody>
				</table>
			</div>

			<div id="convertToBinary">
				<h4>Maak een functie die een decimaal getal omzet naar een binary. Bijv: 9 -> 1001</h4>
				<input type="number" onChange={onChangeDecimal} />
				<button onClick={() => convertToBinary(decimalNumber)}>Converteer</button>
				<span>{binaryNumber}</span>
			</div>
		</div>
	);
}
