# Polarizace rádiových vln
Rádiová vlna má elektrické (`E`) a magnetické (`H`) pole, která jsou na sebe kolmá a společně se šíří prostorem.

Anténa vysílá **polarizované záření** - **polarizace rádiových vln je určena podle směru elektrické složky pole** (na obrázku 1 značeno jako `E`).

::: info Obrázek 1: Grafické znázornění elektromagnetické vlny
![Elektromagnetická vlna](elmagvlna.png)
:::

## Typy polarizací

### Lineární polarizace
**Elektrické pole se pohybuje tam a zpět v jednom směru**, buď vertikálním, nebo horizontálním, zatímco se vlna šíří kupředu.
Na základě toho rozlišujeme o který typ polarizace se jedná. V radioamatérské praxi se používá v drtivé většině případů lineární polarizace (ať už vertikální, nebo horizontální). 

**Většina základních antén (prut, dipól, Yagi) má lineární polarizaci**, která je určena je orientací zářiče antény.

Lineární polarizaci si lze snadno představit takto:

Představ si lano přivázané ke zdi:
- hýbeš-li lanem jen nahoru–dolů, pak pohyb lana imituje vertikální polarizaci
- hýbeš-li lanem jen doleva–doprava, pak pohyb lana imituje horizontální polarizaci


### Kruhová a eliptická polarizace
Když se "smíchají" dvě lineární polarizace (např. vertikální a horizontální) se zpožděním fáze, elektrické pole se začne „otáčet“. U kruhové polarizace konec vektoru elektrického pole opisuje kruh, u eliptické elipsu. Vlna může mít pravotočivou nebo levotočivou rotaci.

V rádiové praxi se kruhová a eliptická polarizace používá např. u některých satelitních spojů, protože je méně citlivá na natočení antény přijímače.


## Proč je polarizace důležitá
**Anténa vysílá i přijímá nejlépe tehdy, když má stejnou polarizaci jako protistanice**, protože antény jsou nejcitlivější elektrickou složku pole `E`. Při shodné polarizaci obou antén se energie vyzářeného signálu účinně předává z vysílací antény do přijímací; při nesouladu polarizací se velká část signálu „ztratí“.

**V praxi však při příjmu signálů zpravidla není polarizace nikdy ideálně vertikální nebo horizontální**. 
Je to proto, že při šíření vln v reálném prostředí část signálu změní polarizaci díky odrazům a vícecestnému šíření (lidově řečeno se signál po cestě „omlátí“). Určitá část signálu na přijímací stranu dorazí i při nesouladu polarizací mezi vysílací a přijímací anténou, ale s velkou ztrátou a nestabilitou.
