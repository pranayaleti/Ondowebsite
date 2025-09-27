import { testimonials } from "../constants/data";

const Testimonials = () => {
  return (
    <section className="mt-20 tracking-wide" aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className="text-3xl sm:text-5xl lg:text-6xl text-center my-10 lg:my-20">
        What People are saying
      </h2>
      <div className="flex flex-wrap justify-center" role="list" aria-label="Customer testimonials">
        {testimonials.map((testimonial, index) => (
          <article key={index} className="w-full sm:w-1/2 lg:w-1/3 px-4 py-2" role="listitem">
            <div className="bg-neutral-900 rounded-md p-6 text-md border border-neutral-800 font-thin h-full flex flex-col">
              <blockquote className="flex-grow">
                <p className="text-neutral-300 leading-relaxed">"{testimonial.text}"</p>
              </blockquote>
              <div className="flex mt-8 items-start">
                <img
                  className="w-12 h-12 mr-6 rounded-full border border-neutral-300 flex-shrink-0"
                  src={testimonial.image}
                  alt={`Profile picture of ${testimonial.user}`}
                  loading="lazy"
                />
                <div>
                  <h3 className="text-white font-semibold">{testimonial.user}</h3>
                  <span className="text-sm font-normal italic text-neutral-400">
                    {testimonial.company}
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
