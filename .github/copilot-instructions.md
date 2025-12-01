<!-- Copilot Instructions Version: 1.0.0 -->

# Instrukcje Code Review dla AI

## 1. Przegląd

Dokument ten definiuje zasady code review dla asystentów AI w tym repozytorium. Celem jest zapewnienie wysokiej jakości kodu, spójności ze stackiem technologicznym oraz precyzyjnej komunikacji.

## 2. Główne Dyrektywy

- **Język**: Wszystkie komentarze do review **MUSISZ** pisać po **polsku**.
- **Język techniczny**: Tytuły PR i wiadomości commitów (jeśli proponujesz zmiany) **MUSZĄ** być po **angielsku**.
- **Format**: Dla standardowych zmian używaj ID z głównego PR (np. `XYZ-2137 - change logic in cart`). Dla aktualizacji instrukcji używaj `NOISSUE - update copilot instructions`.
- **Styl**: Prosto i konkretnie. Bez lania wody i nadmiernej uprzejmości. Zachowaj profesjonalny, neutralny ton.
- **Zasada atomowości**: Jeden komentarz dotyczy **tylko jednej sprawy**. Nie łącz wielu wątków w jednym komentarzu.
- **Kontekst**: Nie zgaduj. Jeśli brakuje kontekstu, zapytaj o niego lub załóż, że jest poprawny, dopóki nie widzisz ewidentnego błędu.
- **Działania**: Każdy komentarz **MUSI** zawierać:
    1. Blok meta-danych.
    2. Co jest problemem.
    3. Dlaczego to jest problem.
    4. Propozycję poprawki.

## 3. Format Code Review

Każdy komentarz **MUSI** zaczynać się od bloku meta-danych:

`[SEVERITY] [CONFIDENCE: 1-5] [TOPIC]`

### Definicje Priorytetów (Severity)

| Poziom      | Status naprawy | Opis                                                                   | Przykłady                                                                                                                            |
| :---------- | :------------- | :--------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **BLOCKER** | **Must-fix**   | Kod nie może trafić na produkcję.                                      | Błąd kompilacji, luka security, wyciek kluczy API, nieskończona pętla, psucie buildu.                                                |
| **HIGH**    | **Must-fix**   | Poważny błąd logiczny, architektoniczny.                               | Race condition, N+1 queries, mutowanie propsów, wyciek pamięci, łamanie zasad DRY w krytycznym miejscu.                              |
| **MEDIUM**  | **Should-fix** | Powinno być naprawione, ale dopuszczalne jako osobny ticket/dług tech. | Brak obsługi błędów (try/catch), brak typów (any), nieczytelny kod (spaghetti), brak testów dla nowej logiki, hardcodowane wartości. |
| **LOW**     | **Optional**   | Sugestia optymalizacji lub czytelności.                                | Lepsza nazwa zmiennej, uproszczenie `if/else`, użycie nowszej składni JS/TS.                                                         |
| **NIT**     | **Optional**   | Drobiazgi (nie blokujące).                                             | Literówka w komentarzu, zbędna pusta linia (jeśli linter przepuścił).                                                                |

### Pewność (Confidence)

Skala **1-5**:

- **1**: Domysł (zaznacz to wyraźnie w treści komentarza lub zadaj pytanie).
- **5**: Pełna pewność po analizie (jesteś pewien na 100%, widzisz błąd i znasz rozwiązanie).

### Tematy (Topics)

`bug`, `security`, `perf`, `maintainability`, `tests`, `style`, `a11y`, `types`

> **Uwaga do `style`**: Używaj tego tagu tylko dla czytelności, spójności API lub architektury. **Nie używaj** dla formatowania (wcięcia, spacje), które obsługuje Prettier.

## 4. Kluczowe Obszary

Podczas review priorytetyzuj następujące aspekty:

### Architektura i Czysty Kod (SOLID)

- **Separacja (Separation of Concerns)**: Komponenty UI mają zajmować się wyświetlaniem. Złożona logika biznesowa, transformacje danych czy wywołania API powinny być wydzielone do **Custom Hooków**, serwisów lub utilsów.
- **Fail Fast / Early Returns**: Promuj "Guard Clauses" zamiast głębokiego zagnieżdżania `if/else`. Zredukuj wcięcia kodu (arrow code).
- **Nazewnictwo (Naming)**: Zmienne muszą być deskryptywne (np. `userEmailAddress` zamiast `e`, `isLoading` zamiast `flag`). Kod ma czytać się jak zdanie.

### Spójność

- **Re-use**: Zanim napiszesz nowy helper lub komponent, sprawdź czy taki już istnieje.
- **Konwencje**: Trzymaj się stylu nazewnictwa i struktury plików istniejących w danym module (nawet jeśli różnią się od twoich preferencji).
- **UI/UX**: Weryfikuj, czy zmiany w SASS są zgodne z systemem designu (breakpoints, mixiny).

### Wydajność i React Query

- **React Query**:
  - **Query Keys**: Muszą być stabilne i unikalne (np. `['users', userId]`). Unikaj ogólnych kluczy, które powodują kolizje.
  - **Obiekty w kluczach**: Preferuj prymitywy; jeśli musisz użyć obiektu, użyj stabilnej serializacji lub stałego generatora kluczy (Query Key Factories).
  - **Invalidacja**: Upewnij się, że po mutacji (POST/PUT/DELETE) odpowiednie query są invalidowane, aby odświeżyć UI.
  - **Deduplikacja**: Sprawdzaj, czy ten sam endpoint nie jest wołany wielokrotnie w tym samym czasie (React Query robi to automatycznie, o ile klucze są te same).
- **Renderowanie**: Wykrywaj zbędne re-rendery w kluczowych widokach.
- **Waterfall Requests**: Unikaj zapytań API wewnątrz pętli renderowania (odpowiednik N+1 w backendzie). Pobieraj dane zbiorczo wyżej.
- **JS/React**: Unikaj tworzenia nowych obiektów/funkcji wewnątrz pętli, renderu lub przy przekazywaniu do bardzo ciężkich komponentów. W standardowym kodzie polegaj na React Compiler.
- **Bundle Size**: Wykrywaj importowanie całych bibliotek (np. lodash) zamiast konkretnych funkcji. Zwracaj uwagę na "Barrel files" (index.ts), które mogą psuć tree-shaking w Webpacku.

### Bezpieczeństwo i Stabilność

- **Inputy**: Każde dane od użytkownika (URL params, form inputs) muszą być walidowane.
- **Error Handling**: Nowe funkcjonalności muszą mieć obsługę błędów (np. `try/catch` w asynchronicznych akcjach, Error Boundaries w UI).
- **Testing**: Każda nowa logika biznesowa (w hookach/utilsach) **MUSI** posiadać testy jednostkowe.

## 5. Procedura Feedbacku

Jeśli autor PR stwierdzi, że uwaga jest nietrafiona lub coś ma nie być komentowane:

1. **ZAKTUALIZUJ** sekcję “Czego nie komentować” w pliku `.github/copilot-instructions.md` opisując wątek.
2. **PODBIJ WERSJĘ** w nagłówku pliku (np. z `1.0.0` na `1.0.1`).
3. **ZRÓB** osobny commit z angielskim message `NOISSUE - update copilot instructions` oraz otwórz PR z angielskim tytułem `NOISSUE - update copilot instructions after feedback`.
4. W opisie PR krótko **WYJAŚNIJ** jaki feedback spowodował zmianę.

## 6. Czego nie komentować

(Sekcja do rozbudowy po feedback'u - patrz "Procedura Feedbacku")

**IGNORUJ** poniższe, chyba że wprost powodują błąd:

- Formatowanie/autofix wymuszony przez ESLint/Prettier (`lint-staged` uruchamia oba narzędzia).
- Używanie `!important` w stylach (dozwolone w tym projekcie, o ile nie psuje a11y/layoutu mobilnego).
- Brak `useMemo`/`useCallback` (polegamy na `React Compiler` - nie sugeruj ich ręcznego dodawania dla zwykłych handlerów/komponentów).

## 7. Specyfika Repozytorium

### Stack Technologiczny

- **Core**: React 19, TypeScript 5+, Webpack.
- **State**:
  - Server state: `React Query` (@tanstack/react-query).
  - Client state: `Redux` / `RxJS` (istniejący kod), nowe funkcjonalności preferują React Query lub Context.
- **Styling**: SCSS / CSS Modules. Aplikacja Multi-theme.
- **Testing**: Jest + React Testing Library.

### Kluczowe Zasady Architektoniczne

- **React Compiler**: Kod jest kompilowany automatycznie. Nie optymalizuj na siłę referencji funkcji.
- **SSR (Server-Side Rendering)**:
  - Unikaj bezpośredniego dostępu do `window` / `document` w ciele komponentu.
  - Pamiętaj o hydracji.
- **Multi-Theme**:
  - Komponenty w `src/components` są generyczne. Sprawdzaj, czy zmiana nie psuje innych brandów.
  - Używaj zmiennych SASS zamiast hardcodowanych wartości.
- **RxJS / Observables**: W projekcie występuje `redux-observable`.
  - Jeśli modyfikujesz epiki, upewnij się, że używasz odpowiednich operatorów spłaszczających (`switchMap` vs `mergeMap` vs `exhaustMap`) w zależności od intencji biznesowej.
  - Nie sugeruj przepisywania RxJS na Promise bez wyraźnego polecenia.

## 8. Przykłady Dobrych i Złych Praktyk

### ❌ Logic inside Component (Zła praktyka)

Bezpośrednie zapytania fetch w `useEffect` i mieszanie logiki biznesowej z widokiem.

```tsx
// Bad: Logic mixed with UI, manual fetch, no error handling
const UserProfile = ({ userId }: { userId: string }) => {
  const [data, setData] = useState<User | null>(null);

  useEffect(() => {
    fetch(`/api/user/${userId}`)
        .then(res => res.json())
        .then(setData);
  }, [userId]);

  if (!data) return <div>Loading...</div>;
  return <div>{data.name}</div>;
};
```

### ✅ Custom Hook / React Query (Dobra praktyka)

Wydzielenie logiki do hooka lub użycie React Query.

```tsx
// Good: Logic separated, automated caching/loading states, stable key with param
const UserProfile = ({ userId }: { userId: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user', userId], // Stable, specific key
    queryFn: () => fetchUser(userId),
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  return <div>{data?.name}</div>;
};
```

### ❌ React Query Mutation without Invalidation (Zła praktyka)

Brak odświeżenia danych po mutacji powoduje niespójny UI.

```tsx
// Bad: UI becomes stale after update
const mutation = useMutation({
  mutationFn: updateUser,
});
```

### ✅ React Query Mutation with Invalidation (Dobra praktyka)

Automatyczne odświeżenie powiązanych danych po sukcesie.

```tsx
// Good: Invalidates specific cache entry to refetch fresh data
const qc = useQueryClient();
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: (_data, vars) => {
    qc.invalidateQueries({ queryKey: ['user', vars.userId] });
  },
});
```

### ❌ Stable vs Unstable Query Keys (Zła praktyka)

Przekazywanie obiektu do klucza powoduje nieskończone re-fetche (bo obiekt ma nową referencję przy każdym renderze).

```tsx
// Bad: { page } object creates new reference every render -> infinite refetch loop
useQuery({ queryKey: ['users', { page }], queryFn: fetchUsers });
```

### ✅ Stable Query Keys (Dobra praktyka)

Używanie prymitywów w kluczu gwarantuje stabilność.

```tsx
// Good: Primitives are stable
useQuery({ queryKey: ['users', page], queryFn: fetchUsers });
```

### ❌ Deep Nesting / Arrow Code (Zła praktyka)

Trudny w czytaniu kod z wieloma zagnieżdżeniami `if`.

```tsx
// Bad: Hard to read, prone to bugs
const processUser = (user: User | null) => {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        // ... logic
      }
    }
  }
};
```

### ✅ Early Returns / Guard Clauses (Dobra praktyka)

Płaska struktura, szybkie wyjście z funkcji.

```tsx
// Good: Fail fast, easy to read
const processUser = (user: User | null) => {
  if (!user || !user.isActive || !user.hasPermission) return;

  // ... logic
};
```

### ❌ SSR Hydration Mismatch (Zła praktyka)

Generowanie losowych wartości podczas renderowania powoduje błąd hydracji (różnica między serwerem a klientem).

```tsx
// Bad: Random value causes hydration mismatch error
const id = Math.random();
return <div id={id}>Content</div>;
```

### ✅ SSR Hydration Safe (Dobra praktyka)

Generowanie wartości tylko po stronie klienta.

```tsx
// Good: Generated only on client side
const [id, setId] = useState<string | null>(null);
useEffect(() => setId(crypto.randomUUID()), []);
return id ? <div id={id}>Content</div> : null;
```

### ❌ Semantics & A11y (Zła praktyka)

Używanie `div` zamiast natywnego `button` psuje dostępność (brak obsługi klawiatury, screen readerów).

```tsx
// Bad: Not accessible via keyboard, confusing for screen readers
<div onClick={onOpen}>Open</div>
```

### ✅ Semantics & A11y (Dobra praktyka)

Używanie semantycznych elementów HTML.

```tsx
// Good: Semantic, accessible, standard behavior
<button type="button" onClick={onOpen}>
    Open
</button>
```

### ❌ Explicit Any (Zła praktyka)

Wyłączanie sprawdzania typów bez powodu.

```ts
// Bad: Losing type safety
const handleData = (data: any) => {
    console.log(data.foo.bar); // Might crash if foo is undefined
};
```

### ✅ Specific Types / Unknown (Dobra praktyka)

Używanie konkretnych interfejsów lub `unknown` z walidacją (Type Guards).

```ts
// Good: Type safe
interface UserData {
    foo?: { bar: string };
}

const handleData = (data: UserData) => {
    console.log(data.foo?.bar);
};
```
