# Trainer

Aplikacja do prowadzenia podopiecznych przez trenera personalnego. Łączy układanie
planów i rejestrowanie wykonanych treningów z prostym CRM-em do zarządzania współpracą.

## Założenia produktu

- Pierwsza wersja jest przeznaczona dla jednego trenera i ma jedno konto administracyjne.
- Dane od początku powinny należeć do trenera, dzięki czemu w przyszłości będzie można
  dodać kolejnych trenerów bez przebudowy całej domeny.
- Podopieczny ma własne konto z dostępem wyłącznie do przypisanych mu planów i własnej
  historii treningowej.
- Dni treningowe nie są przypisywane do konkretnych dat. Podopieczny wybiera trening z
  aktywnego bloku wtedy, kiedy go wykonuje.
- Trener może edytować aktywny blok. Opublikowane zmiany są wersjonowane, aby zachować
  zgodność historycznych raportów z planem, który obowiązywał podczas treningu.
- Plan treningowy opisuje zalecenia, a sesja treningowa zapisuje faktyczne wykonanie. Są
  to osobne dane.

## Role

### Trener

Trener zarządza podopiecznymi, biblioteką ćwiczeń, blokami treningowymi, notatkami,
spotkaniami i płatnościami. W pierwszej wersji jest jednocześnie administratorem całej
aplikacji.

### Podopieczny

Podopieczny przegląda swój aktywny blok, rozpoczyna wybrany trening, zapisuje wykonanie
każdej serii i przegląda własną historię. Nie ma dostępu do wewnętrznych notatek CRM
trenera.

## Podopieczni

Profil podopiecznego zawiera:

- imię i nazwisko,
- adres e-mail i numer telefonu,
- status współpracy: aktywna, wstrzymana lub zakończona,
- datę rozpoczęcia współpracy,
- cele treningowe,
- opis biograficzny i historię treningową,
- kontuzje, ograniczenia oraz inne ważne informacje,
- chronologiczną historię notatek i zdarzeń.

Informacje zdrowotne są danymi wrażliwymi. Są przechowywane jako dane poufne, szyfrowane
po stronie aplikacji i dostępne wyłącznie po sprawdzeniu uprawnień.

## Biblioteka ćwiczeń

Biblioteka trenera i globalny katalog są dostępne na jednym ekranie w osobnych zakładkach.
Definicja ćwiczenia zawiera:

- nazwę,
- instrukcję techniczną,
- opcjonalny link do materiału instruktażowego,
- status aktywny albo archiwalny.

Ćwiczenia bazowe są seedowane wyłącznie z angielskich nazw pochodzących z projektu
[`hasaneyldrm/exercises-dataset`](https://github.com/hasaneyldrm/exercises-dataset). Nie importujemy
obrazów, GIF-ów, instrukcji ani pozostałych metadanych. Są współdzielone przez wszystkich trenerów
i dostępne tylko do odczytu w katalogu. Dodanie pozycji z katalogu tworzy przypisaną do trenera
kopię nazwy, instrukcji i linku. Kopię można niezależnie edytować oraz archiwizować, a późniejsze
zmiany katalogu nie nadpisują zmian trenera. Ponowne dodanie istniejącej kopii nie tworzy duplikatu,
lecz przywraca ją, jeśli była zarchiwizowana.

Trener może również utworzyć ćwiczenie własne bez źródła katalogowego. Kopie z katalogu i
ćwiczenia własne składają się na jego bibliotekę i podlegają tym samym regułom edycji. Wszystkie
warianty są przechowywane w jednej tabeli: `coachId` określa właściciela, `sourceExerciseId` wiąże
kopię ze źródłem, a `isCustom` odróżnia ćwiczenie utworzone ręcznie. Informacje licencyjne znajdują się w
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

Definicja w bibliotece jest niezależna od użycia ćwiczenia w planie. Serie, powtórzenia,
tempo, RIR, przerwy i komentarz trenera należą do konkretnego użycia ćwiczenia w planie,
a nie do biblioteki. Opublikowana wersja planu przechowuje snapshot nazwy, instrukcji i
linku oraz identyfikator ćwiczenia źródłowego. Dzięki temu edycja biblioteki nie zmienia
historycznych planów.

Ćwiczenia są archiwizowane zamiast trwale usuwane, aby zachować ich powiązania z planami.
Kategorie, partie mięśniowe, sprzęt, warianty i własne pliki multimedialne pozostają poza
pierwszą wersją biblioteki.

## Bloki treningowe

Podopieczny może mieć wiele bloków w historii, ale tylko jeden aktywny blok w danym
momencie. Blok zawiera:

- nazwę i opis,
- opcjonalną liczbę tygodni,
- status: szkic, aktywny lub zakończony,
- uporządkowaną listę dni treningowych,
- historię opublikowanych wersji.

Blok nie ma obowiązkowych dat kalendarzowych. Liczba tygodni pełni rolę zalecenia, a nie
sztywnego harmonogramu.

### Dzień treningowy

Dzień treningowy zawiera:

1. nazwę, opis lub cel treningu,
2. rozgrzewkę,
3. uporządkowaną listę ćwiczeń lub grup ćwiczeń,
4. opcjonalne zakończenie, cardio lub cooldown.

Dla ćwiczenia w planie można określić:

- serie, w tym osobno serie rozgrzewkowe i robocze,
- liczbę lub zakres powtórzeń,
- sugerowany ciężar lub sposób progresji,
- tempo,
- docelowy RIR,
- czas przerwy,
- notatkę trenera,
- link instruktażowy.

Serie mogą mieć różne zalecenia, dlatego w modelu danych są osobnymi elementami, nawet
jeżeli interfejs pozwala szybko utworzyć zapis w rodzaju `4 × 8–10`.

### Grupy ćwiczeń

Ćwiczenia mogą być wykonywane jako:

- pojedyncze ćwiczenie,
- superseria,
- triseria,
- obwód.

Grupa określa kolejność ćwiczeń, przerwę między nimi, liczbę rund i przerwę po całej
rundzie.

## Wersjonowanie planu

Trener może edytować szkic bez tworzenia historii. Opublikowanie zmian w aktywnym bloku
tworzy nową, niezmienną wersję planu.

Każda rozpoczęta sesja treningowa zostaje powiązana z wersją planu obowiązującą w chwili
jej rozpoczęcia. Kolejna edycja bloku nie zmienia zaleceń widocznych w istniejącym
raporcie ani historycznych wyników. Nową wersję otrzymują dopiero kolejne sesje.

## Wykonywanie treningu

Ekran treningowy jest projektowany przede wszystkim dla telefonu i obsługi w trakcie
ćwiczeń. Podstawowy przepływ podopiecznego:

1. Logowanie.
2. Wyświetlenie aktywnego bloku.
3. Wybór dnia treningowego.
4. Rozpoczęcie sesji.
5. Uzupełnianie ćwiczeń i serii w zaplanowanej kolejności.
6. Zakończenie sesji i wysłanie raportu.

Przy każdej serii aplikacja pokazuje zalecenie oraz pozwala zapisać faktyczne:

- obciążenie,
- liczbę powtórzeń,
- RIR,
- wykonanie albo pominięcie serii,
- opcjonalną notatkę.

Ekran powinien zapewniać:

- duże pola i przyciski wygodne na telefonie,
- automatyczny zapis po każdej zmianie,
- możliwość przerwania i wznowienia sesji,
- kopiowanie wartości z poprzedniej serii,
- podgląd wyniku z ostatniego wykonania danego ćwiczenia,
- timer przerwy,
- szybkie oznaczanie serii jako wykonanej,
- dostęp do instrukcji oraz filmu,
- możliwość zgłoszenia bólu lub problemu.

Raport powstaje automatycznie z danych wpisywanych podczas treningu. Przy zakończeniu
podopieczny może uzupełnić czas treningu, samopoczucie, ocenę trudności, komentarz i
informację o bólu.

## CRM trenera

Profil podopiecznego ma chronologiczną oś zdarzeń. Może ona zawierać:

- wewnętrzną notatkę trenera,
- spotkanie stacjonarne lub online,
- telefon albo wiadomość,
- wykonany trening,
- zmianę planu,
- płatność,
- zaplanowany kontakt.

### Notatki

Notatka jest standardowa albo poufna. Wszystkie notatki są wewnętrznymi materiałami
trenera i nigdy nie są udostępniane podopiecznemu.

Standardowa notatka jest przechowywana w bazie w zwykłej postaci, pozostając chroniona
przez szyfrowanie infrastruktury i kontrolę dostępu. Tytuł i treść poufnej notatki są
szyfrowane przez aplikację przed zapisem do bazy i odszyfrowywane dopiero po sprawdzeniu
uprawnień użytkownika.

Trener wybiera poziom poufności podczas tworzenia notatki. Notatki zawierające informacje
o kontuzjach, przeciwwskazaniach, bólu lub stanie zdrowia muszą być poufne. Zmiana
notatki z poufnej na standardową wymaga jawnego potwierdzenia.

Poufne treści nie są umieszczane w logach, analityce, komunikatach błędów ani
powiadomieniach. W MVP nie są objęte wyszukiwaniem pełnotekstowym. Oś zdarzeń może
pokazywać ich metadane, ale treść jest pobierana i odszyfrowywana dopiero przy otwarciu.

Spotkanie lub kontakt zawiera datę, rodzaj, status, notatkę oraz opcjonalny termin
następnego kontaktu.

Płatność zawiera:

- kwotę i walutę,
- datę płatności lub termin zapłaty,
- okres, którego dotyczy,
- status: oczekująca, zapłacona lub zaległa,
- termin kolejnej płatności,
- opcjonalną notatkę.

Pierwsza wersja jedynie ewidencjonuje płatności. Nie obsługuje przelewów, subskrypcji ani
faktur.

## Widoki trenera

- dashboard z najważniejszymi zadaniami, zaległymi płatnościami i nadchodzącymi
  kontaktami,
- lista podopiecznych,
- profil podopiecznego z zakładkami: przegląd, plan, aktywność, notatki, spotkania i
  płatności,
- biblioteka ćwiczeń,
- edytor bloku i dni treningowych,
- podgląd raportów i historii progresu.

## Zakres MVP

- jedno konto trenera-administratora,
- konta podopiecznych i kontrola dostępu,
- lista oraz profile podopiecznych,
- biblioteka ćwiczeń,
- tworzenie, publikowanie i wersjonowanie bloków,
- dni treningowe, serie, powtórzenia, obciążenie, tempo, RIR i przerwy,
- superserie, triserie i obwody,
- mobilny ekran wykonywania treningu z automatycznym zapisem,
- raport i historia wykonanych sesji,
- standardowe i szyfrowane notatki poufne, kontakty i spotkania,
- prosta ewidencja płatności.

## Poza pierwszą wersją

- wielu trenerów i zarządzanie zespołem,
- szablony oraz kopiowanie bloków między podopiecznymi,
- wykresy i pogłębiona analiza progresu,
- kalendarz i synchronizacja z zewnętrznymi kalendarzami,
- automatyczne przypomnienia o treningach, kontaktach i płatnościach,
- przesyłanie zdjęć oraz filmów przez podopiecznych,
- płatności online, subskrypcje i faktury,
- aplikacje natywne i tryb offline.

## Gotowość na wielu trenerów

Interfejs MVP nie udostępnia zarządzania trenerami, ale dane biznesowe powinny być
powiązane z właścicielem-trenerem. Dotyczy to co najmniej podopiecznych, ćwiczeń, bloków,
notatek, spotkań i płatności. Relacja podopiecznego z trenerem powinna być reprezentowana
osobno, zamiast zakładać globalną własność profilu użytkownika. Pozwoli to później dodać
drugiego trenera lub współdzielenie podopiecznego bez migracji podstawowych pojęć domeny.

## Ochrona danych poufnych

Komunikacja z aplikacją i bazą danych jest szyfrowana podczas przesyłania, a baza oraz
jej kopie zapasowe korzystają z szyfrowania zapewnianego przez infrastrukturę. Dodatkowo
aplikacja szyfruje zawartość notatek poufnych przed przekazaniem jej do bazy.

Szyfrowanie aplikacyjne korzysta z uwierzytelnionego algorytmu, na przykład AES-256-GCM.
Klucz szyfrujący:

- jest przechowywany poza bazą danych w sekretach środowiska lub usłudze zarządzania
  kluczami,
- jest niezależny od sekretów sesji i ciasteczek,
- ma zapisywaną wersję, aby umożliwić jego późniejszą rotację,
- jest dostępny wyłącznie dla kodu wykonywanego po stronie serwera.

Zaszyfrowany rekord przechowuje szyfrogram, wymagane parametry kryptograficzne i wersję
klucza. Jawne pozostają jedynie metadane potrzebne do działania systemu, takie jak
identyfikator, powiązanie z trenerem i podopiecznym, poziom poufności oraz daty.

System nie zapisuje odszyfrowanej treści w pamięciach podręcznych ani logach. Dostęp do
danych poufnych wymaga każdorazowej autoryzacji, a docelowo odczyty i zmiany mogą być
rejestrowane w dzienniku audytowym.

## Kierunek techniczny

Projekt korzysta z Next.js App Router, TypeScript i Tailwind CSS. Dane oraz
uwierzytelnianie są oparte na Neon Postgres i Neon Auth. Kod jest organizowany według
funkcji biznesowych, z rozdzieleniem domeny, przypadków użycia, portów i adapterów.
