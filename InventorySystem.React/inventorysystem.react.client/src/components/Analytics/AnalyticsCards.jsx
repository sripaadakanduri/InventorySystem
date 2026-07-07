export default function AnalyticsCards({ cards }) {

    return (

        <div className="group grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {

                cards.map((card, index) => {

                    const Icon = card.icon;

                    return (

                        <div

                            key={index}

                            className="group bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition duration-300"

                        >

                            <div className="flex justify-between items-center">

                                <div>

                                    <p className="text-gray-500">

                                        {card.title}

                                    </p>

                                    <h2 className="text-3xl font-bold mt-2">

                                        {card.value}

                                    </h2>

                                </div>

                                <div className="bg-blue-100 p-3 rounded-full">

                                    <Icon

                                        size={24}

                                        className="text-blue-600"

                                    />

                                </div>

                            </div>

                        </div>

                    );

                })

            }

        </div>

    );

}