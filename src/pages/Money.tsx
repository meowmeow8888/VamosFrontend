import MenuBar from "../components/menuBar";
import { MoneyTrader } from "../components/MoneyTrader";

function Money() {
  return (
    <>
      <div className="flex flex-col items-center mt-6 gap-y-4">
        <MoneyTrader name="Guy Mosseri" balance={1234.23}></MoneyTrader>
        <MoneyTrader name="Orr Sarid " balance={-1234.23}></MoneyTrader>
      </div>
      <MenuBar></MenuBar>
    </>
  );
}

export default Money;
